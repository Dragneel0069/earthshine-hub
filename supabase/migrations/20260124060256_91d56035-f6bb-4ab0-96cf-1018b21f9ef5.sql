-- Enhance carbon_projects with marketplace fields
ALTER TABLE public.carbon_projects 
ADD COLUMN IF NOT EXISTS registry TEXT DEFAULT 'verra',
ADD COLUMN IF NOT EXISTS methodology_id TEXT,
ADD COLUMN IF NOT EXISTS developer TEXT,
ADD COLUMN IF NOT EXISTS verification_body TEXT,
ADD COLUMN IF NOT EXISTS permanence_risk TEXT DEFAULT 'low',
ADD COLUMN IF NOT EXISTS additionality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
ADD COLUMN IF NOT EXISTS sdg_alignment JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS co_benefits TEXT[];

-- Credit Batches - vintage tracking
CREATE TABLE IF NOT EXISTS public.credit_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.carbon_projects(id) ON DELETE CASCADE NOT NULL,
  vintage_year INTEGER NOT NULL,
  total_credits NUMERIC NOT NULL DEFAULT 0,
  available_credits NUMERIC NOT NULL DEFAULT 0,
  reserved_credits NUMERIC NOT NULL DEFAULT 0,
  retired_credits NUMERIC NOT NULL DEFAULT 0,
  price_per_ton NUMERIC NOT NULL,
  serial_number_start TEXT,
  serial_number_end TEXT,
  registry_status TEXT DEFAULT 'active',
  quality_score INTEGER DEFAULT 0,
  quality_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_batches ENABLE ROW LEVEL SECURITY;

-- Marketplace Orders
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id UUID,
  batch_id UUID REFERENCES public.credit_batches(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.carbon_projects(id) ON DELETE SET NULL,
  credits_purchased NUMERIC NOT NULL,
  price_per_credit NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  commission_amount NUMERIC DEFAULT 0,
  gst_amount NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  escrow_status TEXT DEFAULT 'none',
  retirement_status TEXT DEFAULT 'none',
  retirement_requested_at TIMESTAMP WITH TIME ZONE,
  retirement_confirmed_at TIMESTAMP WITH TIME ZONE,
  registry_retirement_id TEXT,
  certificate_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Immutable Credit Ledger
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.credit_batches(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  credits_amount NUMERIC NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

-- Retirement Certificates
CREATE TABLE IF NOT EXISTS public.retirement_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT NOT NULL UNIQUE,
  order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE SET NULL NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  registry TEXT NOT NULL,
  vintage_year INTEGER NOT NULL,
  credits_retired NUMERIC NOT NULL,
  serial_numbers TEXT,
  retirement_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  beneficiary_name TEXT,
  beneficiary_statement TEXT,
  verification_hash TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.retirement_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for credit_batches
CREATE POLICY "Anyone can view active batches" ON public.credit_batches
  FOR SELECT USING (registry_status = 'active');

CREATE POLICY "Admins can manage batches" ON public.credit_batches
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for marketplace_orders
CREATE POLICY "Users can view own orders" ON public.marketplace_orders
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create orders" ON public.marketplace_orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update own pending orders" ON public.marketplace_orders
  FOR UPDATE USING (auth.uid() = buyer_id AND payment_status = 'pending');

CREATE POLICY "Admins can manage all orders" ON public.marketplace_orders
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for credit_ledger (append-only, read for authenticated)
CREATE POLICY "Authenticated users can view ledger" ON public.credit_ledger
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert ledger entries" ON public.credit_ledger
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for retirement_certificates
CREATE POLICY "Users can view own certificates" ON public.retirement_certificates
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Admins can manage certificates" ON public.retirement_certificates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Trigger to update batch credits on order status change
CREATE OR REPLACE FUNCTION public.update_batch_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When payment confirmed, move credits to reserved
  IF NEW.payment_status = 'completed' AND OLD.payment_status = 'pending' AND NEW.escrow_status = 'held' THEN
    UPDATE credit_batches
    SET available_credits = available_credits - NEW.credits_purchased,
        reserved_credits = reserved_credits + NEW.credits_purchased,
        updated_at = now()
    WHERE id = NEW.batch_id;
    
    -- Log to ledger
    INSERT INTO credit_ledger (batch_id, order_id, action, credits_amount, actor_id, metadata)
    VALUES (NEW.batch_id, NEW.id, 'reserved', NEW.credits_purchased, NEW.buyer_id, 
            jsonb_build_object('order_number', NEW.order_number));
  END IF;
  
  -- When retirement confirmed, move to retired
  IF NEW.retirement_status = 'confirmed' AND OLD.retirement_status != 'confirmed' THEN
    UPDATE credit_batches
    SET reserved_credits = reserved_credits - NEW.credits_purchased,
        retired_credits = retired_credits + NEW.credits_purchased,
        updated_at = now()
    WHERE id = NEW.batch_id;
    
    -- Log to ledger
    INSERT INTO credit_ledger (batch_id, order_id, action, credits_amount, actor_id, metadata)
    VALUES (NEW.batch_id, NEW.id, 'retired', NEW.credits_purchased, NEW.buyer_id,
            jsonb_build_object('registry_id', NEW.registry_retirement_id));
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_update ON public.marketplace_orders;
CREATE TRIGGER on_order_update
  AFTER UPDATE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_batch_on_order();

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.order_number := 'ZG-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                      LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_order_number ON public.marketplace_orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.certificate_number := 'ZG-CERT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_certificate_number ON public.retirement_certificates;
CREATE TRIGGER set_certificate_number
  BEFORE INSERT ON public.retirement_certificates
  FOR EACH ROW EXECUTE FUNCTION public.generate_certificate_number();