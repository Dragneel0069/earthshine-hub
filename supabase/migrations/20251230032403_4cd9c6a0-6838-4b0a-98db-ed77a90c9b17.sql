-- Fix 1: RAG Documents - Require authentication for write operations
DROP POLICY IF EXISTS "Documents can be inserted publicly" ON public.rag_documents;
DROP POLICY IF EXISTS "Documents can be deleted publicly" ON public.rag_documents;

CREATE POLICY "Only admins can insert documents"
ON public.rag_documents
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete documents"
ON public.rag_documents
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update documents"
ON public.rag_documents
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: RAG Chunks - Require authentication for write operations
DROP POLICY IF EXISTS "Chunks can be inserted publicly" ON public.rag_chunks;
DROP POLICY IF EXISTS "Chunks can be deleted publicly" ON public.rag_chunks;

CREATE POLICY "Only admins can insert chunks"
ON public.rag_chunks
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete chunks"
ON public.rag_chunks
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update chunks"
ON public.rag_chunks
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 3: RAG Conversations - Require authentication
DROP POLICY IF EXISTS "Conversations are publicly accessible" ON public.rag_conversations;

CREATE POLICY "Authenticated users can view conversations"
ON public.rag_conversations
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create conversations"
ON public.rag_conversations
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update conversations"
ON public.rag_conversations
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete conversations"
ON public.rag_conversations
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Fix 4: RAG Messages - Require authentication
DROP POLICY IF EXISTS "Messages are publicly accessible" ON public.rag_messages;

CREATE POLICY "Authenticated users can view messages"
ON public.rag_messages
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create messages"
ON public.rag_messages
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update messages"
ON public.rag_messages
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete messages"
ON public.rag_messages
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Fix 5: Quiz Responses - Remove NULL user_id loophole
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON public.quiz_responses;

CREATE POLICY "Users can view their own quiz responses"
ON public.quiz_responses
FOR SELECT
USING (
  user_id IN (
    SELECT users.id FROM users WHERE users.user_id = auth.uid()
  )
);

-- Fix 6: Restrict anonymous quiz creation to require session_id
DROP POLICY IF EXISTS "Anyone can create quiz responses" ON public.quiz_responses;

CREATE POLICY "Authenticated users can create quiz responses"
ON public.quiz_responses
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL OR session_id IS NOT NULL
);