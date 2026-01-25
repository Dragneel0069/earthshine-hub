-- Fix audit_catalog_changes to use correct parameter order for log_to_ledger
-- log_to_ledger signature: (_org_id uuid, _entity_type text, _entity_id uuid, _action text, _before jsonb, _after jsonb, _metadata jsonb)

CREATE OR REPLACE FUNCTION public.audit_catalog_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_to_ledger(
      NULL::uuid,           -- _org_id (catalog is not org-scoped)
      'credits_catalog',    -- _entity_type
      NEW.id,               -- _entity_id
      'catalog_created',    -- _action
      NULL,                 -- _before
      to_jsonb(NEW)         -- _after
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_to_ledger(
      NULL::uuid,           -- _org_id
      'credits_catalog',    -- _entity_type
      NEW.id,               -- _entity_id
      'catalog_updated',    -- _action
      to_jsonb(OLD),        -- _before
      to_jsonb(NEW)         -- _after
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;