import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, conversationId, messages = [] } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log("RAG chat query:", query);

    // Step 1: Generate embedding for the query
    const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
        dimensions: 768,
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error("Embedding API error:", errorText);
      throw new Error(`Embedding API error: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data?.[0]?.embedding;

    if (!queryEmbedding) {
      throw new Error("Failed to generate query embedding");
    }

    // Step 2: Search for similar chunks
    const { data: similarChunks, error: searchError } = await supabase.rpc(
      "search_similar_chunks",
      {
        query_embedding: `[${queryEmbedding.join(",")}]`,
        match_threshold: 0.3,
        match_count: 5,
      }
    );

    if (searchError) {
      console.error("Search error:", searchError);
      throw searchError;
    }

    console.log(`Found ${similarChunks?.length || 0} relevant chunks`);

    // Step 3: Build context from retrieved chunks
    const context = similarChunks && similarChunks.length > 0
      ? similarChunks
          .map((chunk: any) => `[Source: ${chunk.document_title}]\n${chunk.content}`)
          .join("\n\n---\n\n")
      : "No relevant documents found in the knowledge base.";

    const sources = similarChunks?.map((chunk: any) => ({
      documentId: chunk.document_id,
      title: chunk.document_title,
      similarity: chunk.similarity,
      excerpt: chunk.content.substring(0, 200) + "...",
    })) || [];

    // Step 4: Generate response using Lovable AI with context
    const systemPrompt = `You are a knowledgeable assistant specializing in carbon markets, carbon crediting mechanisms, audit & assurance guidance, and sustainability reporting. You help users understand complex sustainability and carbon market topics.

IMPORTANT INSTRUCTIONS:
1. Base your answers primarily on the provided context from the knowledge base
2. If the context contains relevant information, cite it in your response
3. If the context doesn't contain enough information, acknowledge this and provide general guidance based on your knowledge
4. Be precise and professional in your responses
5. When discussing carbon credits, always clarify the verification standard and methodology when relevant
6. For audit guidance, reference applicable standards (ISO 14064, VCS, Gold Standard, etc.) when appropriate

CONTEXT FROM KNOWLEDGE BASE:
${context}`;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content: query },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: chatMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Return streaming response with sources in header
    const responseHeaders = {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "X-RAG-Sources": JSON.stringify(sources),
    };

    return new Response(response.body, { headers: responseHeaders });
  } catch (error) {
    console.error("Error in rag-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
