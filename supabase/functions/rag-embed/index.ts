import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// SECURITY: Rate Limiting Configuration
// ============================================
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 document uploads per minute per IP
const MAX_REQUESTS_PER_USER = 15; // 15 document uploads per minute per authenticated user

// In-memory rate limit store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetIn: record.resetTime - now };
}

function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

// ============================================
// SECURITY: Input Validation
// ============================================
const MAX_CONTENT_LENGTH = 100000; // 100KB
const MAX_TITLE_LENGTH = 255;
const MAX_URL_LENGTH = 2048;

interface ValidatedInput {
  documentId?: string;
  content: string;
  title: string;
  sourceType: "text" | "file" | "url";
  sourceUrl?: string;
}

function validateInput(body: unknown): { valid: true; data: ValidatedInput } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }
  
  const { documentId, content, title, sourceType, sourceUrl } = body as Record<string, unknown>;
  
  // Validate documentId (optional UUID)
  if (documentId !== undefined && documentId !== null) {
    if (typeof documentId !== "string") {
      return { valid: false, error: "DocumentId must be a string" };
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(documentId)) {
      return { valid: false, error: "Invalid documentId format" };
    }
  }
  
  // Validate content (required)
  if (typeof content !== "string") {
    return { valid: false, error: "Content must be a string" };
  }
  
  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    return { valid: false, error: "Content cannot be empty" };
  }
  
  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: `Content must be less than ${MAX_CONTENT_LENGTH} characters (${Math.round(MAX_CONTENT_LENGTH / 1024)}KB)` };
  }
  
  // Validate title (required)
  if (typeof title !== "string") {
    return { valid: false, error: "Title must be a string" };
  }
  
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    return { valid: false, error: "Title cannot be empty" };
  }
  
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Title must be less than ${MAX_TITLE_LENGTH} characters` };
  }
  
  // Validate sourceType
  const validSourceTypes = ["text", "file", "url"];
  const validatedSourceType = (sourceType || "text") as string;
  if (!validSourceTypes.includes(validatedSourceType)) {
    return { valid: false, error: "Invalid sourceType. Must be 'text', 'file', or 'url'" };
  }
  
  // Validate sourceUrl (optional)
  let validatedSourceUrl: string | undefined;
  if (sourceUrl !== undefined && sourceUrl !== null) {
    if (typeof sourceUrl !== "string") {
      return { valid: false, error: "SourceUrl must be a string" };
    }
    
    if (sourceUrl.length > MAX_URL_LENGTH) {
      return { valid: false, error: `SourceUrl must be less than ${MAX_URL_LENGTH} characters` };
    }
    
    // Basic URL validation
    try {
      const url = new URL(sourceUrl);
      if (!["http:", "https:"].includes(url.protocol)) {
        return { valid: false, error: "SourceUrl must use http or https protocol" };
      }
      validatedSourceUrl = sourceUrl;
    } catch {
      return { valid: false, error: "Invalid URL format" };
    }
  }
  
  return {
    valid: true,
    data: {
      documentId: documentId as string | undefined,
      content: trimmedContent,
      title: sanitize(trimmedTitle),
      sourceType: validatedSourceType as "text" | "file" | "url",
      sourceUrl: validatedSourceUrl,
    },
  };
}

// Sanitize string to prevent injection
function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

// Chunk text into smaller pieces
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
    // ============================================
    // SECURITY: Rate Limiting Check
    // ============================================
    const clientIP = getClientIP(req);
    const authHeader = req.headers.get("authorization");
    const userId = authHeader ? authHeader.replace("Bearer ", "").substring(0, 36) : null;
    
    // Check IP-based rate limit
    const ipRateLimit = checkRateLimit(`ip:${clientIP}`, MAX_REQUESTS_PER_WINDOW);
    if (!ipRateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil(ipRateLimit.resetIn / 1000)
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(ipRateLimit.resetIn / 1000)),
            "X-RateLimit-Remaining": "0"
          } 
        }
      );
    }
    
    // Check user-based rate limit
    if (userId) {
      const userRateLimit = checkRateLimit(`user:${userId}`, MAX_REQUESTS_PER_USER);
      if (!userRateLimit.allowed) {
        console.warn(`Rate limit exceeded for user: ${userId}`);
        return new Response(
          JSON.stringify({ 
            error: "Too many requests. Please try again later.",
            retryAfter: Math.ceil(userRateLimit.resetIn / 1000)
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json",
              "Retry-After": String(Math.ceil(userRateLimit.resetIn / 1000)),
              "X-RateLimit-Remaining": "0"
            } 
          }
        );
      }
    }

    // ============================================
    // SECURITY: Input Validation
    // ============================================
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { documentId, content, title, sourceType, sourceUrl } = validation.data;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase configuration");
      throw new Error("Service configuration error");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Processing document:", title, "Content length:", content.length);

    // Create or update document
    let docId = documentId;
    if (!docId) {
      const { data: doc, error: docError } = await supabase
        .from("rag_documents")
        .insert({
          title,
          source_type: sourceType,
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

    // Insert chunks (search_vector will be auto-generated by trigger)
    const chunksToInsert = chunks.map((chunk, index) => ({
      document_id: docId,
      content: chunk,
      chunk_index: index,
    }));

    const { error: chunkError } = await supabase
      .from("rag_chunks")
      .insert(chunksToInsert);

    if (chunkError) {
      console.error("Error inserting chunks:", chunkError);
      throw chunkError;
    }

    console.log(`Inserted ${chunks.length} chunks with full-text search enabled`);

    return new Response(
      JSON.stringify({
        success: true,
        documentId: docId,
        chunksCreated: chunks.length,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(ipRateLimit.remaining)
        } 
      }
    );
  } catch (error) {
    console.error("Error in rag-embed function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
