-- Fix 1: Add user_id to rag_conversations for ownership tracking
ALTER TABLE public.rag_conversations 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix 2: Drop overly permissive policies on rag_conversations
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.rag_conversations;
DROP POLICY IF EXISTS "Authenticated users can delete conversations" ON public.rag_conversations;
DROP POLICY IF EXISTS "Authenticated users can update conversations" ON public.rag_conversations;
DROP POLICY IF EXISTS "Authenticated users can view conversations" ON public.rag_conversations;

-- Create proper ownership-based policies for rag_conversations
CREATE POLICY "Users can create their own conversations" 
ON public.rag_conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own conversations" 
ON public.rag_conversations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON public.rag_conversations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
ON public.rag_conversations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix 3: Drop overly permissive policies on rag_messages
DROP POLICY IF EXISTS "Authenticated users can create messages" ON public.rag_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON public.rag_messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON public.rag_messages;
DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.rag_messages;

-- Create proper ownership-based policies for rag_messages (link to conversation ownership)
CREATE POLICY "Users can create messages in their conversations" 
ON public.rag_messages 
FOR INSERT 
WITH CHECK (conversation_id IN (
  SELECT id FROM public.rag_conversations WHERE user_id = auth.uid()
));

CREATE POLICY "Users can view messages in their conversations" 
ON public.rag_messages 
FOR SELECT 
USING (conversation_id IN (
  SELECT id FROM public.rag_conversations WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update messages in their conversations" 
ON public.rag_messages 
FOR UPDATE 
USING (conversation_id IN (
  SELECT id FROM public.rag_conversations WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete messages in their conversations" 
ON public.rag_messages 
FOR DELETE 
USING (conversation_id IN (
  SELECT id FROM public.rag_conversations WHERE user_id = auth.uid()
));

-- Fix 4: Update rag_documents policies - restrict to authenticated users only
DROP POLICY IF EXISTS "Documents are publicly readable" ON public.rag_documents;
CREATE POLICY "Authenticated users can read documents" 
ON public.rag_documents 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix 5: Update rag_chunks policies - restrict to authenticated users only  
DROP POLICY IF EXISTS "Chunks are publicly readable" ON public.rag_chunks;
CREATE POLICY "Authenticated users can read chunks" 
ON public.rag_chunks 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix 6: Add explicit public access denial for users table
CREATE POLICY "Deny anonymous access to users" 
ON public.users 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix 7: Add explicit public access denial for recs table  
CREATE POLICY "Deny anonymous access to recs"
ON public.recs
FOR SELECT
USING (auth.uid() IS NOT NULL);