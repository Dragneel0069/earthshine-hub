-- Organization settings for onboarding
CREATE TABLE IF NOT EXISTS public.organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  industry_type TEXT,
  company_size TEXT,
  baseline_year INTEGER,
  financial_year_start TEXT DEFAULT 'April',
  locations JSONB DEFAULT '[]'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

-- CSV imports tracking
CREATE TABLE IF NOT EXISTS public.csv_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  import_type TEXT NOT NULL,
  row_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  errors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.csv_imports ENABLE ROW LEVEL SECURITY;

-- Suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  category TEXT NOT NULL,
  annual_spend NUMERIC DEFAULT 0,
  emissions_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  last_updated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Supplier data requests
CREATE TABLE IF NOT EXISTS public.supplier_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  request_type TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  due_date TIMESTAMP WITH TIME ZONE,
  response_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.supplier_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organization_settings
CREATE POLICY "Users can view own organization" ON public.organization_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own organization" ON public.organization_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own organization" ON public.organization_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for csv_imports
CREATE POLICY "Users can view own imports" ON public.csv_imports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create imports" ON public.csv_imports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own imports" ON public.csv_imports
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for suppliers
CREATE POLICY "Users can view own suppliers" ON public.suppliers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own suppliers" ON public.suppliers
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for supplier_requests
CREATE POLICY "Users can view own requests" ON public.supplier_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own requests" ON public.supplier_requests
  FOR ALL USING (auth.uid() = user_id);

-- Trigger for auto-assigning viewer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Update timestamp trigger for organization_settings
DROP TRIGGER IF EXISTS update_organization_settings_updated_at ON public.organization_settings;
CREATE TRIGGER update_organization_settings_updated_at
  BEFORE UPDATE ON public.organization_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();