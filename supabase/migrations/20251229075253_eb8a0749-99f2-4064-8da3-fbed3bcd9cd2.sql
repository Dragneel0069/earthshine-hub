-- Add full-text search column to rag_chunks
ALTER TABLE public.rag_chunks ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS rag_chunks_search_idx ON public.rag_chunks USING GIN(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION public.update_rag_chunk_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-update search vector
DROP TRIGGER IF EXISTS rag_chunks_search_vector_trigger ON public.rag_chunks;
CREATE TRIGGER rag_chunks_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.rag_chunks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_rag_chunk_search_vector();

-- Create full-text search function
CREATE OR REPLACE FUNCTION public.search_chunks_fulltext(
  search_query TEXT,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  rank REAL,
  document_title TEXT
)
LANGUAGE plpgsql
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

-- Also add full-text search to documents table
ALTER TABLE public.rag_documents ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS rag_documents_search_idx ON public.rag_documents USING GIN(search_vector);

CREATE OR REPLACE FUNCTION public.update_rag_document_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS rag_documents_search_vector_trigger ON public.rag_documents;
CREATE TRIGGER rag_documents_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.rag_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_rag_document_search_vector();