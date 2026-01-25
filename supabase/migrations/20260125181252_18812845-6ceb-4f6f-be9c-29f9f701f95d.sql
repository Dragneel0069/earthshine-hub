
-- =============================================
-- PHASE 3: MARKETPLACE TABLES (with function drops)
-- =============================================

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.generate_order_number();
DROP FUNCTION IF EXISTS public.generate_certificate_number();

-- =============================================
-- 1. CREDITS CATALOG (Available credits for purchase)
-- =============================================
CREATE TABLE IF NOT EXISTS public.credits_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Project identification
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  registry TEXT NOT NULL,
  methodology_id TEXT,
  
  -- Credit details
  vintage_year INTEGER NOT NULL,
  total_credits NUMERIC NOT NULL DEFAULT 0,
  available_credits NUMERIC NOT NULL DEFAULT 0,
  reserved_credits NUMERIC NOT NULL DEFAULT 0,
  retired_credits NUMERIC NOT NULL DEFAULT 0,
  price_per_ton NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  
  -- Location & verification
  country TEXT NOT NULL DEFAULT 'India',
  state TEXT,
  verification_body TEXT,
  verification_date DATE,
  
  -- Quality scoring (0-100)
  quality_score INTEGER NOT NULL DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  quality_breakdown JSONB DEFAULT '{}'::jsonb,
  
  -- Additional info
  description TEXT,
  co_benefits TEXT[],
  sdg_alignment INTEGER[],
  image_url TEXT,
  documentation_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  listed_by UUID REFERENCES public.profiles(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credits_catalog ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view active credits" ON public.credits_catalog;
DROP POLICY IF EXISTS "Platform admins can manage catalog" ON public.credits_catalog;

-- Public read for active listings
CREATE POLICY "Anyone can view active credits"
  ON public.credits_catalog FOR SELECT
  USING (is_active = true);

-- Platform admins can manage catalog
CREATE POLICY "Platform admins can manage catalog"
  ON public.credits_catalog FOR ALL
  USING (has_platform_role(auth.uid(), 'platform_admin'));

-- =============================================
-- 2. CREDIT ORDERS (Org-scoped purchases)
-- =============================================
CREATE TABLE IF NOT EXISTS public.credit_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  
  -- Organization making the purchase
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  
  -- Credit being purchased
  catalog_id UUID NOT NULL REFERENCES public.credits_catalog(id),
  
  -- Order details
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  price_per_ton NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  gst_amount NUMERIC NOT NULL DEFAULT 0,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  
  -- Beneficiary details
  beneficiary_name TEXT,
  beneficiary_type TEXT,
  retirement_reason TEXT,
  
  -- Status workflow
  status order_status NOT NULL DEFAULT 'initiated',
  
  -- Payment tracking
  payment_method TEXT,
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  
  -- Escrow tracking
  escrow_started_at TIMESTAMPTZ,
  escrow_released_at TIMESTAMPTZ,
  
  -- Retirement tracking
  retired_at TIMESTAMPTZ,
  registry_retirement_id TEXT,
  
  -- Cancellation/failure
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT,
  
  -- Audit trail
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credit_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Members can view org orders" ON public.credit_orders;
DROP POLICY IF EXISTS "Transactors can create orders" ON public.credit_orders;
DROP POLICY IF EXISTS "Transactors can update pending orders" ON public.credit_orders;
DROP POLICY IF EXISTS "Platform admins can manage orders" ON public.credit_orders;

-- Org members with marketplace permission can view orders
CREATE POLICY "Members can view org orders"
  ON public.credit_orders FOR SELECT
  USING (has_permission(auth.uid(), org_id, 'can_view_marketplace'));

-- Members with transact permission can create orders
CREATE POLICY "Transactors can create orders"
  ON public.credit_orders FOR INSERT
  WITH CHECK (
    has_permission(auth.uid(), org_id, 'can_transact') 
    AND created_by = auth.uid()
  );

-- Members with transact permission can update non-retired orders
CREATE POLICY "Transactors can update pending orders"
  ON public.credit_orders FOR UPDATE
  USING (
    has_permission(auth.uid(), org_id, 'can_transact')
    AND status NOT IN ('retired', 'cancelled', 'failed')
  );

-- Platform admins can manage all orders
CREATE POLICY "Platform admins can manage orders"
  ON public.credit_orders FOR ALL
  USING (has_platform_role(auth.uid(), 'platform_admin'));

-- =============================================
-- 3. RETIREMENT PROOFS (Immutable certificates)
-- =============================================
CREATE TABLE IF NOT EXISTS public.retirement_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT UNIQUE NOT NULL,
  
  -- Link to order
  order_id UUID NOT NULL REFERENCES public.credit_orders(id),
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  
  -- Credit details at time of retirement (snapshot)
  catalog_snapshot JSONB NOT NULL,
  quantity NUMERIC NOT NULL,
  
  -- Beneficiary
  beneficiary_name TEXT NOT NULL,
  beneficiary_type TEXT,
  retirement_reason TEXT,
  
  -- Registry confirmation
  registry TEXT NOT NULL,
  registry_retirement_id TEXT,
  registry_confirmation_date DATE,
  
  -- Verification
  verification_hash TEXT,
  blockchain_tx_id TEXT,
  
  -- Certificate generation
  certificate_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Immutability
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.retirement_proofs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Members can view org certificates" ON public.retirement_proofs;
DROP POLICY IF EXISTS "Retirees can create certificates" ON public.retirement_proofs;
DROP POLICY IF EXISTS "Platform admins can view all certificates" ON public.retirement_proofs;
DROP POLICY IF EXISTS "Auditors can view all certificates" ON public.retirement_proofs;

-- Org members can view their certificates
CREATE POLICY "Members can view org certificates"
  ON public.retirement_proofs FOR SELECT
  USING (has_permission(auth.uid(), org_id, 'can_view_marketplace'));

-- Only members with retire permission can create
CREATE POLICY "Retirees can create certificates"
  ON public.retirement_proofs FOR INSERT
  WITH CHECK (has_permission(auth.uid(), org_id, 'can_retire_credits'));

-- Platform admins can view all
CREATE POLICY "Platform admins can view all certificates"
  ON public.retirement_proofs FOR SELECT
  USING (has_platform_role(auth.uid(), 'platform_admin'));

-- Auditors can view all certificates
CREATE POLICY "Auditors can view all certificates"
  ON public.retirement_proofs FOR SELECT
  USING (has_platform_role(auth.uid(), 'auditor'));

-- =============================================
-- 4. ORDER NUMBER GENERATOR
-- =============================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  year_prefix TEXT;
  sequence_num INTEGER;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 4) AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM public.credit_orders
  WHERE order_number LIKE 'ZG' || year_prefix || '%';
  
  new_number := 'ZG' || year_prefix || LPAD(sequence_num::TEXT, 6, '0');
  RETURN new_number;
END;
$$;

-- =============================================
-- 5. CERTIFICATE NUMBER GENERATOR
-- =============================================
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  year_prefix TEXT;
  sequence_num INTEGER;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(certificate_number FROM 5) AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM public.retirement_proofs
  WHERE certificate_number LIKE 'ZGR' || year_prefix || '%';
  
  new_number := 'ZGR' || year_prefix || LPAD(sequence_num::TEXT, 6, '0');
  RETURN new_number;
END;
$$;

-- =============================================
-- 6. INITIATE ORDER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.initiate_order(
  _org_id UUID,
  _catalog_id UUID,
  _quantity NUMERIC,
  _beneficiary_name TEXT DEFAULT NULL,
  _beneficiary_type TEXT DEFAULT NULL,
  _retirement_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _catalog RECORD;
  _order_id UUID;
  _order_number TEXT;
  _subtotal NUMERIC;
  _gst NUMERIC;
  _platform_fee NUMERIC;
  _total NUMERIC;
BEGIN
  -- Check permission
  IF NOT has_permission(auth.uid(), _org_id, 'can_transact') THEN
    RAISE EXCEPTION 'User does not have transaction permission';
  END IF;
  
  -- Get catalog and lock row
  SELECT * INTO _catalog
  FROM public.credits_catalog
  WHERE id = _catalog_id AND is_active = true
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Credit listing not found or inactive';
  END IF;
  
  -- Check availability
  IF _catalog.available_credits < _quantity THEN
    RAISE EXCEPTION 'Insufficient credits available';
  END IF;
  
  -- Calculate amounts
  _subtotal := _quantity * _catalog.price_per_ton;
  _gst := _subtotal * 0.18;
  _platform_fee := _subtotal * 0.05;
  _total := _subtotal + _gst + _platform_fee;
  
  -- Generate order number
  _order_number := generate_order_number();
  _order_id := gen_random_uuid();
  
  -- Reserve credits
  UPDATE public.credits_catalog
  SET 
    available_credits = available_credits - _quantity,
    reserved_credits = reserved_credits + _quantity,
    updated_at = now()
  WHERE id = _catalog_id;
  
  -- Create order
  INSERT INTO public.credit_orders (
    id, order_number, org_id, catalog_id, quantity,
    price_per_ton, subtotal, gst_amount, platform_fee, total_amount,
    beneficiary_name, beneficiary_type, retirement_reason,
    status, created_by
  ) VALUES (
    _order_id, _order_number, _org_id, _catalog_id, _quantity,
    _catalog.price_per_ton, _subtotal, _gst, _platform_fee, _total,
    _beneficiary_name, _beneficiary_type, _retirement_reason,
    'initiated', auth.uid()
  );
  
  -- Log to ledger
  PERFORM log_to_ledger(
    'order_initiated',
    'credit_order',
    _order_id,
    _org_id,
    NULL,
    jsonb_build_object(
      'order_number', _order_number,
      'catalog_id', _catalog_id,
      'quantity', _quantity,
      'total_amount', _total
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'order_id', _order_id,
    'order_number', _order_number,
    'total_amount', _total
  );
END;
$$;

-- =============================================
-- 7. MARK ORDER PAID FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.mark_order_paid(
  _order_id UUID,
  _payment_reference TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order RECORD;
BEGIN
  SELECT * INTO _order
  FROM public.credit_orders
  WHERE id = _order_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  IF NOT has_permission(auth.uid(), _order.org_id, 'can_transact') THEN
    RAISE EXCEPTION 'User does not have transaction permission';
  END IF;
  
  IF _order.status != 'initiated' THEN
    RAISE EXCEPTION 'Order is not in initiated status';
  END IF;
  
  UPDATE public.credit_orders
  SET 
    status = 'paid',
    payment_reference = _payment_reference,
    paid_at = now(),
    updated_at = now()
  WHERE id = _order_id;
  
  PERFORM log_to_ledger(
    'order_paid',
    'credit_order',
    _order_id,
    _order.org_id,
    jsonb_build_object('status', 'initiated'),
    jsonb_build_object('status', 'paid', 'payment_reference', _payment_reference)
  );
  
  RETURN jsonb_build_object('success', true, 'status', 'paid');
END;
$$;

-- =============================================
-- 8. START ESCROW FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.start_escrow(_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order RECORD;
BEGIN
  SELECT * INTO _order
  FROM public.credit_orders
  WHERE id = _order_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  IF NOT has_platform_role(auth.uid(), 'platform_admin') THEN
    RAISE EXCEPTION 'Only platform admin can start escrow';
  END IF;
  
  IF _order.status != 'paid' THEN
    RAISE EXCEPTION 'Order must be paid first';
  END IF;
  
  UPDATE public.credit_orders
  SET 
    status = 'in_escrow',
    escrow_started_at = now(),
    updated_at = now()
  WHERE id = _order_id;
  
  PERFORM log_to_ledger(
    'escrow_started',
    'credit_order',
    _order_id,
    _order.org_id,
    jsonb_build_object('status', 'paid'),
    jsonb_build_object('status', 'in_escrow')
  );
  
  RETURN jsonb_build_object('success', true, 'status', 'in_escrow');
END;
$$;

-- =============================================
-- 9. COMPLETE RETIREMENT FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.complete_retirement(
  _order_id UUID,
  _registry_retirement_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order RECORD;
  _catalog RECORD;
  _cert_id UUID;
  _cert_number TEXT;
BEGIN
  SELECT * INTO _order
  FROM public.credit_orders
  WHERE id = _order_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  IF NOT (
    has_platform_role(auth.uid(), 'platform_admin') OR
    has_permission(auth.uid(), _order.org_id, 'can_retire_credits')
  ) THEN
    RAISE EXCEPTION 'User does not have retirement permission';
  END IF;
  
  IF _order.status != 'in_escrow' THEN
    RAISE EXCEPTION 'Order must be in escrow';
  END IF;
  
  SELECT * INTO _catalog FROM public.credits_catalog WHERE id = _order.catalog_id;
  
  UPDATE public.credits_catalog
  SET 
    reserved_credits = reserved_credits - _order.quantity,
    retired_credits = retired_credits + _order.quantity,
    updated_at = now()
  WHERE id = _order.catalog_id;
  
  UPDATE public.credit_orders
  SET 
    status = 'retired',
    registry_retirement_id = _registry_retirement_id,
    retired_at = now(),
    escrow_released_at = now(),
    updated_at = now()
  WHERE id = _order_id;
  
  _cert_id := gen_random_uuid();
  _cert_number := generate_certificate_number();
  
  INSERT INTO public.retirement_proofs (
    id, certificate_number, order_id, org_id,
    catalog_snapshot, quantity,
    beneficiary_name, beneficiary_type, retirement_reason,
    registry, registry_retirement_id, registry_confirmation_date,
    verification_hash
  ) VALUES (
    _cert_id, _cert_number, _order_id, _order.org_id,
    to_jsonb(_catalog), _order.quantity,
    COALESCE(_order.beneficiary_name, 'Organization'),
    _order.beneficiary_type, _order.retirement_reason,
    _catalog.registry, _registry_retirement_id, CURRENT_DATE,
    encode(sha256((_cert_number || _order_id::TEXT || _order.quantity::TEXT)::bytea), 'hex')
  );
  
  PERFORM log_to_ledger(
    'credits_retired',
    'credit_order',
    _order_id,
    _order.org_id,
    jsonb_build_object('status', 'in_escrow'),
    jsonb_build_object(
      'status', 'retired',
      'certificate_number', _cert_number,
      'quantity', _order.quantity
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'status', 'retired',
    'certificate_id', _cert_id,
    'certificate_number', _cert_number
  );
END;
$$;

-- =============================================
-- 10. CANCEL ORDER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION public.cancel_order(
  _order_id UUID,
  _reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order RECORD;
BEGIN
  SELECT * INTO _order
  FROM public.credit_orders
  WHERE id = _order_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  IF NOT (
    has_platform_role(auth.uid(), 'platform_admin') OR
    has_permission(auth.uid(), _order.org_id, 'can_transact')
  ) THEN
    RAISE EXCEPTION 'User does not have permission to cancel';
  END IF;
  
  IF _order.status NOT IN ('initiated', 'paid') THEN
    RAISE EXCEPTION 'Cannot cancel order in this status';
  END IF;
  
  UPDATE public.credits_catalog
  SET 
    available_credits = available_credits + _order.quantity,
    reserved_credits = reserved_credits - _order.quantity,
    updated_at = now()
  WHERE id = _order.catalog_id;
  
  UPDATE public.credit_orders
  SET 
    status = 'cancelled',
    cancelled_at = now(),
    cancellation_reason = _reason,
    updated_at = now()
  WHERE id = _order_id;
  
  PERFORM log_to_ledger(
    'order_cancelled',
    'credit_order',
    _order_id,
    _order.org_id,
    jsonb_build_object('status', _order.status),
    jsonb_build_object('status', 'cancelled', 'reason', _reason)
  );
  
  RETURN jsonb_build_object('success', true, 'status', 'cancelled');
END;
$$;

-- =============================================
-- 11. IMMUTABILITY TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS prevent_retirement_proof_update ON public.retirement_proofs;
DROP TRIGGER IF EXISTS prevent_retirement_proof_delete ON public.retirement_proofs;
DROP TRIGGER IF EXISTS prevent_retired_order_changes ON public.credit_orders;

CREATE OR REPLACE FUNCTION public.prevent_retirement_proof_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Retirement proofs are immutable';
END;
$$;

CREATE TRIGGER prevent_retirement_proof_update
  BEFORE UPDATE ON public.retirement_proofs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_retirement_proof_changes();

CREATE TRIGGER prevent_retirement_proof_delete
  BEFORE DELETE ON public.retirement_proofs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_retirement_proof_changes();

CREATE OR REPLACE FUNCTION public.prevent_retired_order_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('retired', 'cancelled', 'failed') THEN
    RAISE EXCEPTION 'Cannot modify order in final status';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_retired_order_changes
  BEFORE UPDATE ON public.credit_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_retired_order_changes();

-- =============================================
-- 12. AUDIT TRIGGER FOR CATALOG
-- =============================================
DROP TRIGGER IF EXISTS audit_catalog_changes ON public.credits_catalog;

CREATE OR REPLACE FUNCTION public.audit_catalog_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_to_ledger(
      'catalog_created',
      'credits_catalog',
      NEW.id,
      NULL,
      NULL,
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_to_ledger(
      'catalog_updated',
      'credits_catalog',
      NEW.id,
      NULL,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_catalog_changes
  AFTER INSERT OR UPDATE ON public.credits_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_catalog_changes();

-- =============================================
-- 13. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_credits_catalog_active ON public.credits_catalog(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_credits_catalog_country ON public.credits_catalog(country);
CREATE INDEX IF NOT EXISTS idx_credits_catalog_project_type ON public.credits_catalog(project_type);
CREATE INDEX IF NOT EXISTS idx_credits_catalog_registry ON public.credits_catalog(registry);
CREATE INDEX IF NOT EXISTS idx_credits_catalog_quality ON public.credits_catalog(quality_score DESC);

CREATE INDEX IF NOT EXISTS idx_credit_orders_org ON public.credit_orders(org_id);
CREATE INDEX IF NOT EXISTS idx_credit_orders_status ON public.credit_orders(status);
CREATE INDEX IF NOT EXISTS idx_credit_orders_created ON public.credit_orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_retirement_proofs_org ON public.retirement_proofs(org_id);
CREATE INDEX IF NOT EXISTS idx_retirement_proofs_order ON public.retirement_proofs(order_id);

-- =============================================
-- 14. GRANTS
-- =============================================
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_certificate_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.initiate_order(UUID, UUID, NUMERIC, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_order_paid(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_escrow(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_retirement(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_order(UUID, TEXT) TO authenticated;
