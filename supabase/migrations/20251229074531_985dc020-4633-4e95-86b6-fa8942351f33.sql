-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for knowledge base documents
CREATE TABLE public.rag_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('file', 'url', 'text')),
  source_url TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for document chunks with embeddings
CREATE TABLE public.rag_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.rag_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for chat conversations
CREATE TABLE public.rag_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for chat messages
CREATE TABLE public.rag_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.rag_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for vector similarity search
CREATE INDEX rag_chunks_embedding_idx ON public.rag_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for document lookups
CREATE INDEX rag_chunks_document_id_idx ON public.rag_chunks(document_id);
CREATE INDEX rag_messages_conversation_id_idx ON public.rag_messages(conversation_id);

-- Enable RLS
ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for knowledge base (documents are shared)
CREATE POLICY "Documents are publicly readable" ON public.rag_documents
FOR SELECT USING (true);

CREATE POLICY "Documents can be inserted publicly" ON public.rag_documents
FOR INSERT WITH CHECK (true);

CREATE POLICY "Documents can be deleted publicly" ON public.rag_documents
FOR DELETE USING (true);

CREATE POLICY "Chunks are publicly readable" ON public.rag_chunks
FOR SELECT USING (true);

CREATE POLICY "Chunks can be inserted publicly" ON public.rag_chunks
FOR INSERT WITH CHECK (true);

CREATE POLICY "Chunks can be deleted publicly" ON public.rag_chunks
FOR DELETE USING (true);

CREATE POLICY "Conversations are publicly accessible" ON public.rag_conversations
FOR ALL USING (true);

CREATE POLICY "Messages are publicly accessible" ON public.rag_messages
FOR ALL USING (true);

-- Function to search similar chunks
CREATE OR REPLACE FUNCTION public.search_similar_chunks(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  similarity FLOAT,
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
    1 - (c.embedding <=> query_embedding) AS similarity,
    d.title AS document_title
  FROM rag_chunks c
  JOIN rag_documents d ON c.document_id = d.id
  WHERE c.embedding IS NOT NULL
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_rag_documents_updated_at
  BEFORE UPDATE ON public.rag_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rag_conversations_updated_at
  BEFORE UPDATE ON public.rag_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();