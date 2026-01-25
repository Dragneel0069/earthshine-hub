-- ============================================
-- PHASE 2: EMISSIONS & REPORTS WITH APPROVAL
-- Immutability after approval/locking
-- ============================================

-- ============================================
-- 1. EMISSIONS RECORDS (Org-scoped, Immutable)
-- ============================================

CREATE TABLE public.emissions_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Emission data
  scope int NOT NULL CHECK (scope IN (1, 2, 3)),
  category text NOT NULL,
  sub_category text,
  source text,                    -- e.g., 'Diesel Generator', 'Grid Electricity'
  activity_data numeric NOT NULL,
  activity_unit text NOT NULL,    -- e.g., 'liters', 'kWh', 'kg'
  emission_factor numeric,
  emission_factor_source text,    -- e.g., 'IPCC 2021', 'CEA India 2023'
  co2e_kg numeric NOT NULL,       -- Calculated emissions in kg CO2e
  
  -- Context
  facility_location text,
  reporting_period_start date NOT NULL,
  reporting_period_end date NOT NULL,
  reporting_year int NOT NULL,
  
  -- Approval workflow
  status record_status NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  approved_by uuid REFERENCES public.profiles(id),
  approved_at timestamptz,
  locked_at timestamptz,
  rejection_reason text,
  
  -- Metadata
  notes text,
  evidence_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.emissions_records ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_emissions_org ON public.emissions_records(org_id);
CREATE INDEX idx_emissions_year ON public.emissions_records(reporting_year);
CREATE INDEX idx_emissions_scope ON public.emissions_records(scope);
CREATE INDEX idx_emissions_status ON public.emissions_records(status);

-- RLS: View emissions (members with permission)
CREATE POLICY "Members can view emissions" ON public.emissions_records
  FOR SELECT USING (
    public.has_permission(auth.uid(), org_id, 'can_view_emissions')
  );

-- RLS: Create emissions (editors only)
CREATE POLICY "Editors can create emissions" ON public.emissions_records
  FOR INSERT WITH CHECK (
    public.has_permission(auth.uid(), org_id, 'can_edit_emissions')
    AND created_by = auth.uid()
  );

-- RLS: Update emissions (only drafts, by editors)
CREATE POLICY "Editors can update draft emissions" ON public.emissions_records
  FOR UPDATE USING (
    public.has_permission(auth.uid(), org_id, 'can_edit_emissions')
    AND status = 'draft'
  )
  WITH CHECK (
    status IN ('draft', 'pending_review')  -- Can only move to pending_review
  );

-- RLS: Delete emissions (only drafts)
CREATE POLICY "Editors can delete draft emissions" ON public.emissions_records
  FOR DELETE USING (
    public.has_permission(auth.uid(), org_id, 'can_edit_emissions')
    AND status = 'draft'
  );

-- ============================================
-- 2. REPORTS TABLE (BRSR, GHG, CDP, Internal)
-- ============================================

CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Report identity
  report_type report_type NOT NULL,
  title text NOT NULL,
  reporting_year int NOT NULL,
  reporting_period_start date,
  reporting_period_end date,
  
  -- Content
  report_data jsonb NOT NULL DEFAULT '{}',  -- Structured report content
  summary text,
  
  -- Files
  file_url text,                  -- Generated PDF
  supporting_docs jsonb DEFAULT '[]',
  
  -- Approval workflow
  status record_status NOT NULL DEFAULT 'draft',
  version int DEFAULT 1,
  
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  approved_by uuid REFERENCES public.profiles(id),
  approved_at timestamptz,
  locked_at timestamptz,
  locked_by uuid REFERENCES public.profiles(id),
  rejection_reason text,
  
  -- Metadata
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Unique constraint: one report type per year per org
  UNIQUE(org_id, report_type, reporting_year, version)
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_reports_org ON public.reports(org_id);
CREATE INDEX idx_reports_type ON public.reports(report_type);
CREATE INDEX idx_reports_year ON public.reports(reporting_year);
CREATE INDEX idx_reports_status ON public.reports(status);

-- RLS: View reports
CREATE POLICY "Members can view reports" ON public.reports
  FOR SELECT USING (
    public.has_permission(auth.uid(), org_id, 'can_view_reports')
  );

-- RLS: Create reports
CREATE POLICY "Generators can create reports" ON public.reports
  FOR INSERT WITH CHECK (
    public.has_permission(auth.uid(), org_id, 'can_generate_reports')
    AND created_by = auth.uid()
  );

-- RLS: Update reports (only drafts or pending_review)
CREATE POLICY "Generators can update draft reports" ON public.reports
  FOR UPDATE USING (
    public.has_permission(auth.uid(), org_id, 'can_generate_reports')
    AND status IN ('draft', 'pending_review')
  );

-- RLS: Delete reports (only drafts)
CREATE POLICY "Generators can delete draft reports" ON public.reports
  FOR DELETE USING (
    public.has_permission(auth.uid(), org_id, 'can_generate_reports')
    AND status = 'draft'
  );

-- ============================================
-- 3. APPROVAL FUNCTIONS (SECURITY DEFINER)
-- ============================================

-- Submit emission for review
CREATE OR REPLACE FUNCTION public.submit_emission_for_review(_emission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _emission emissions_records%ROWTYPE;
BEGIN
  SELECT * INTO _emission FROM emissions_records WHERE id = _emission_id;
  
  IF _emission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Emission not found');
  END IF;
  
  IF NOT has_permission(auth.uid(), _emission.org_id, 'can_edit_emissions') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
  END IF;
  
  IF _emission.status != 'draft' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only draft emissions can be submitted');
  END IF;
  
  UPDATE emissions_records
  SET status = 'pending_review', updated_at = now()
  WHERE id = _emission_id;
  
  -- Log to ledger
  PERFORM log_to_ledger(
    _emission.org_id,
    'emission',
    _emission_id,
    'submitted_for_review',
    to_jsonb(_emission),
    jsonb_build_object('status', 'pending_review')
  );
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Approve emission
CREATE OR REPLACE FUNCTION public.approve_emission(_emission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _emission emissions_records%ROWTYPE;
BEGIN
  SELECT * INTO _emission FROM emissions_records WHERE id = _emission_id;
  
  IF _emission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Emission not found');
  END IF;
  
  IF NOT has_permission(auth.uid(), _emission.org_id, 'can_approve_emissions') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
  END IF;
  
  IF _emission.status != 'pending_review' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only pending emissions can be approved');
  END IF;
  
  UPDATE emissions_records
  SET status = 'approved',
      approved_by = auth.uid(),
      approved_at = now(),
      updated_at = now()
  WHERE id = _emission_id;
  
  -- Log to ledger
  PERFORM log_to_ledger(
    _emission.org_id,
    'emission',
    _emission_id,
    'approved',
    to_jsonb(_emission),
    jsonb_build_object('status', 'approved', 'approved_by', auth.uid())
  );
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Reject emission
CREATE OR REPLACE FUNCTION public.reject_emission(_emission_id uuid, _reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _emission emissions_records%ROWTYPE;
BEGIN
  SELECT * INTO _emission FROM emissions_records WHERE id = _emission_id;
  
  IF _emission.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Emission not found');
  END IF;
  
  IF NOT has_permission(auth.uid(), _emission.org_id, 'can_approve_emissions') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
  END IF;
  
  IF _emission.status != 'pending_review' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only pending emissions can be rejected');
  END IF;
  
  UPDATE emissions_records
  SET status = 'rejected',
      rejection_reason = _reason,
      updated_at = now()
  WHERE id = _emission_id;
  
  -- Log to ledger
  PERFORM log_to_ledger(
    _emission.org_id,
    'emission',
    _emission_id,
    'rejected',
    to_jsonb(_emission),
    jsonb_build_object('status', 'rejected', 'reason', _reason)
  );
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Submit report for review
CREATE OR REPLACE FUNCTION public.submit_report_for_review(_report_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _report reports%ROWTYPE;
BEGIN
  SELECT * INTO _report FROM reports WHERE id = _report_id;
  
  IF _report.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Report not found');
  END IF;
  
  IF NOT has_permission(auth.uid(), _report.org_id, 'can_generate_reports') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
  END IF;
  
  IF _report.status != 'draft' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only draft reports can be submitted');
  END IF;
  
  UPDATE reports
  SET status = 'pending_review', updated_at = now()
  WHERE id = _report_id;
  
  PERFORM log_to_ledger(
    _report.org_id,
    'report',
    _report_id,
    'submitted_for_review',
    to_jsonb(_report),
    jsonb_build_object('status', 'pending_review')
  );
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Approve report
CREATE OR REPLACE FUNCTION public.approve_report(_report_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _report reports%ROWTYPE;
BEGIN
  SELECT * INTO _report FROM reports WHERE id = _report_id;
  
  IF _report.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Report not found');
  END IF;
  
  IF NOT has_permission(auth.uid(), _report.org_id, 'can_approve_reports') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
  END IF;
  
  IF _report.status != 'pending_review' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only pending reports can be approved');
  END IF;
  
  UPDATE reports
  SET status = 'approved',
      approved_by = auth.uid(),
      approved_at = now(),
      updated_at = now()
  WHERE id = _report_id;
  
  PERFORM log_to_ledger(
    _report.org_id,
    'report',
    _report_id,
    'approved',
    to_jsonb(_report),
    jsonb_build_object('status', 'approved', 'approved_by', auth.uid())
  );
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Lock report (PERMANENT - cannot be unlocked)
CREATE OR REPLACE FUNCTION public.lock_report(_report_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _report reports%ROWTYPE;
BEGIN
  SELECT * INTO _report FROM reports WHERE id = _report_id;
  
  IF _report.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Report not found');
  END IF;
  
  IF NOT has_permission(auth.uid(), _report.org_id, 'can_approve_reports') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
  END IF;
  
  IF _report.status != 'approved' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only approved reports can be locked');
  END IF;
  
  UPDATE reports
  SET status = 'locked',
      locked_at = now(),
      locked_by = auth.uid(),
      updated_at = now()
  WHERE id = _report_id;
  
  PERFORM log_to_ledger(
    _report.org_id,
    'report',
    _report_id,
    'locked',
    to_jsonb(_report),
    jsonb_build_object('status', 'locked', 'locked_by', auth.uid(), 'message', 'Report permanently locked')
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'Report permanently locked');
END;
$$;

-- ============================================
-- 4. IMMUTABILITY ENFORCEMENT (Triggers)
-- ============================================

-- Prevent updates to locked/approved emissions
CREATE OR REPLACE FUNCTION public.enforce_emission_immutability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('approved', 'locked') THEN
    RAISE EXCEPTION 'Cannot modify approved or locked emission records';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_emission_immutability_trigger
  BEFORE UPDATE ON public.emissions_records
  FOR EACH ROW EXECUTE FUNCTION public.enforce_emission_immutability();

-- Prevent updates to locked reports
CREATE OR REPLACE FUNCTION public.enforce_report_immutability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'locked' THEN
    RAISE EXCEPTION 'Cannot modify locked reports';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_report_immutability_trigger
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.enforce_report_immutability();

-- Prevent deletion of non-draft records
CREATE OR REPLACE FUNCTION public.prevent_approved_deletion()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status != 'draft' THEN
    RAISE EXCEPTION 'Cannot delete non-draft records';
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER prevent_emission_deletion_trigger
  BEFORE DELETE ON public.emissions_records
  FOR EACH ROW EXECUTE FUNCTION public.prevent_approved_deletion();

CREATE TRIGGER prevent_report_deletion_trigger
  BEFORE DELETE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.prevent_approved_deletion();

-- ============================================
-- 5. AUDIT TRIGGERS FOR EMISSIONS & REPORTS
-- ============================================

CREATE OR REPLACE FUNCTION public.log_emission_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_to_ledger(NEW.org_id, 'emission', NEW.id, 'created', NULL, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_to_ledger(NEW.org_id, 'emission', NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER log_emission_changes_trigger
  AFTER INSERT OR UPDATE ON public.emissions_records
  FOR EACH ROW EXECUTE FUNCTION public.log_emission_changes();

CREATE OR REPLACE FUNCTION public.log_report_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_to_ledger(NEW.org_id, 'report', NEW.id, 'created', NULL, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_to_ledger(NEW.org_id, 'report', NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER log_report_changes_trigger
  AFTER INSERT OR UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.log_report_changes();

-- Updated_at triggers
CREATE TRIGGER update_emissions_updated_at
  BEFORE UPDATE ON public.emissions_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();