-- ============================================
-- SECURITY HARDENING MIGRATION
-- ============================================

-- 1. Fix quiz_responses RLS policy (remove anonymous viewing)
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON public.quiz_responses;

CREATE POLICY "Users can view their own quiz responses" 
ON public.quiz_responses FOR SELECT 
USING (user_id IN (SELECT id FROM users WHERE user_id = auth.uid()));

-- 2. Fix credit_ledger - restrict to own transactions only
DROP POLICY IF EXISTS "Authenticated users can view credit ledger" ON public.credit_ledger;

CREATE POLICY "Users can view own credit transactions" 
ON public.credit_ledger FOR SELECT 
TO authenticated
USING (
  actor_id IN (SELECT id FROM users WHERE user_id = auth.uid())
  OR actor_id IS NULL -- System transactions visible to admins only
  AND public.has_role(auth.uid(), 'admin')
);

-- 3. Fix search_chunks_fulltext function search path
CREATE OR REPLACE FUNCTION public.search_chunks_fulltext(search_query text, match_count integer DEFAULT 5)
RETURNS TABLE(id uuid, document_id uuid, content text, rank real, document_title text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.document_id,
    c.content,
    ts_rank(c.search_vector, plainto_tsquery('english', search_query)) AS rank,
    d.title AS document_title
  FROM rag_chunks c
  JOIN rag_documents d ON c.document_id = d.id
  WHERE c.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY ts_rank(c.search_vector, plainto_tsquery('english', search_query)) DESC
  LIMIT match_count;
END;
$$;

-- 4. Fix update_rag_chunk_search_vector trigger function search path
CREATE OR REPLACE FUNCTION public.update_rag_chunk_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.content);
  RETURN NEW;
END;
$$;

-- 5. Fix update_rag_document_search_vector trigger function search path  
CREATE OR REPLACE FUNCTION public.update_rag_document_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$;

-- 6. CREATE AUDIT LOG TABLE for ESG compliance
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- System can insert audit logs (via triggers/functions)
CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 7. Create audit trigger function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- 8. Attach audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_emissions ON public.emissions;
CREATE TRIGGER audit_emissions
AFTER INSERT OR UPDATE OR DELETE ON public.emissions
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_marketplace_orders ON public.marketplace_orders;
CREATE TRIGGER audit_marketplace_orders
AFTER INSERT OR UPDATE OR DELETE ON public.marketplace_orders
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_credit_batches ON public.credit_batches;
CREATE TRIGGER audit_credit_batches
AFTER INSERT OR UPDATE OR DELETE ON public.credit_batches
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;
CREATE TRIGGER audit_user_roles
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_subscriptions ON public.subscriptions;
CREATE TRIGGER audit_subscriptions
AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- 9. Add GST number format validation
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS gst_format_check;
ALTER TABLE public.users ADD CONSTRAINT gst_format_check 
CHECK (
  gst_number IS NULL OR 
  gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
);