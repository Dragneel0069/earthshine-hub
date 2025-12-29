import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Chunk text into smaller pieces for embedding
function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Keep overlap from the end of current chunk
      const words = currentChunk.split(" ");
      const overlapWords = words.slice(-Math.ceil(overlap / 10));
      currentChunk = overlapWords.join(" ") + " " + trimmedSentence;
    } else {
      currentChunk += (currentChunk ? ". " : "") + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, content, title, sourceType, sourceUrl } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log("Processing document:", title);

    // Create or update document
    let docId = documentId;
    if (!docId) {
      const { data: doc, error: docError } = await supabase
        .from("rag_documents")
        .insert({
          title,
          source_type: sourceType || "text",
          source_url: sourceUrl,
          content,
        })
        .select()
        .single();

      if (docError) {
        console.error("Error creating document:", docError);
        throw docError;
      }
      docId = doc.id;
      console.log("Created document:", docId);
    }

    // Chunk the content
    const chunks = chunkText(content);
    console.log(`Created ${chunks.length} chunks`);

    // Delete existing chunks for this document
    await supabase.from("rag_chunks").delete().eq("document_id", docId);

    // Generate embeddings for each chunk using Lovable AI
    const embeddedChunks = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Embedding chunk ${i + 1}/${chunks.length}`);

      // Use Lovable AI to generate embeddings via chat completions
      // We'll ask the model to process the text and use a consistent embedding approach
      const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: chunk,
          dimensions: 768,
        }),
      });

      if (!embeddingResponse.ok) {
        const errorText = await embeddingResponse.text();
        console.error("Embedding API error:", errorText);
        throw new Error(`Embedding API error: ${embeddingResponse.status}`);
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data?.[0]?.embedding;

      if (!embedding) {
        console.error("No embedding returned for chunk:", i);
        continue;
      }

      embeddedChunks.push({
        document_id: docId,
        content: chunk,
        chunk_index: i,
        embedding: `[${embedding.join(",")}]`,
      });
    }

    // Insert all chunks with embeddings
    if (embeddedChunks.length > 0) {
      const { error: chunkError } = await supabase
        .from("rag_chunks")
        .insert(embeddedChunks);

      if (chunkError) {
        console.error("Error inserting chunks:", chunkError);
        throw chunkError;
      }
      console.log(`Inserted ${embeddedChunks.length} chunks with embeddings`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentId: docId,
        chunksCreated: embeddedChunks.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in rag-embed function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
