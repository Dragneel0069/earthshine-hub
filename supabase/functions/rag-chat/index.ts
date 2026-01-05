import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-request-timestamp, x-request-nonce, x-request-signature",
};

// ============================================
// SECURITY: Request Signing - Replay Attack Prevention
// ============================================
const REQUEST_TIMESTAMP_TOLERANCE_MS = 30000; // 30 seconds
const usedNonces = new Map<string, number>(); // nonce -> expiry timestamp

// Clean up expired nonces periodically
function cleanupNonces() {
  const now = Date.now();
  for (const [nonce, expiry] of usedNonces.entries()) {
    if (now > expiry) {
      usedNonces.delete(nonce);
    }
  }
}

// Verify request signature
async function verifyRequestSignature(
  req: Request,
  body: string
): Promise<{ valid: boolean; error?: string }> {
  const timestamp = req.headers.get("x-request-timestamp");
  const nonce = req.headers.get("x-request-nonce");
  const signature = req.headers.get("x-request-signature");

  // If no signing headers, allow request (backwards compatibility)
  // In production, you might want to require signing
  if (!timestamp && !nonce && !signature) {
    return { valid: true };
  }

  // If some headers present but not all, reject
  if (!timestamp || !nonce || !signature) {
    return { valid: false, error: "Missing request signing headers" };
  }

  // Validate timestamp format
  const timestampNum = parseInt(timestamp, 10);
  if (isNaN(timestampNum)) {
    return { valid: false, error: "Invalid timestamp format" };
  }

  // Check timestamp is within tolerance window
  const now = Date.now();
  const timeDiff = Math.abs(now - timestampNum);
  if (timeDiff > REQUEST_TIMESTAMP_TOLERANCE_MS) {
    console.warn(`Request timestamp too old: ${timeDiff}ms diff`);
    return { valid: false, error: "Request expired. Please try again." };
  }

  // Check nonce hasn't been used
  if (usedNonces.has(nonce)) {
    console.warn(`Nonce reuse detected: ${nonce}`);
    return { valid: false, error: "Duplicate request detected" };
  }

  // Validate nonce format (32 hex chars)
  if (!/^[a-f0-9]{32}$/i.test(nonce)) {
    return { valid: false, error: "Invalid nonce format" };
  }

  // Verify signature
  const message = `${timestamp}.${nonce}.${body}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  if (signature !== expectedSignature) {
    console.warn("Invalid request signature");
    return { valid: false, error: "Invalid request signature" };
  }

  // Store nonce with expiry (cleanup window + tolerance)
  usedNonces.set(nonce, now + REQUEST_TIMESTAMP_TOLERANCE_MS * 2);
  
  // Periodic cleanup
  if (usedNonces.size > 1000) {
    cleanupNonces();
  }

  return { valid: true };
}

// ============================================
// SECURITY: Rate Limiting Configuration
// ============================================
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute per IP
const MAX_REQUESTS_PER_USER = 30; // 30 requests per minute per authenticated user

// In-memory rate limit store (resets on function cold start)
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
const MAX_QUERY_LENGTH = 1000;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_MESSAGES = 50;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

function validateInput(body: unknown): { valid: true; data: { query: string; conversationId?: string; messages: Message[] } } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }
  
  const { query, conversationId, messages = [] } = body as Record<string, unknown>;
  
  // Validate query
  if (typeof query !== "string") {
    return { valid: false, error: "Query must be a string" };
  }
  
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return { valid: false, error: "Query cannot be empty" };
  }
  
  if (trimmedQuery.length > MAX_QUERY_LENGTH) {
    return { valid: false, error: `Query must be less than ${MAX_QUERY_LENGTH} characters` };
  }
  
  // Validate conversationId (optional UUID)
  if (conversationId !== undefined && conversationId !== null) {
    if (typeof conversationId !== "string") {
      return { valid: false, error: "ConversationId must be a string" };
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(conversationId)) {
      return { valid: false, error: "Invalid conversationId format" };
    }
  }
  
  // Validate messages array
  if (!Array.isArray(messages)) {
    return { valid: false, error: "Messages must be an array" };
  }
  
  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }
  
  const validatedMessages: Message[] = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i] as unknown;
    if (!msg || typeof msg !== "object") {
      return { valid: false, error: `Message at index ${i} is invalid` };
    }
    
    const { role, content } = msg as Record<string, unknown>;
    
    if (!["user", "assistant", "system"].includes(role as string)) {
      return { valid: false, error: `Invalid role at message ${i}` };
    }
    
    if (typeof content !== "string") {
      return { valid: false, error: `Message content at index ${i} must be a string` };
    }
    
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message at index ${i} exceeds max length` };
    }
    
    validatedMessages.push({ role: role as Message["role"], content });
  }
  
  return { 
    valid: true, 
    data: { 
      query: trimmedQuery, 
      conversationId: conversationId as string | undefined,
      messages: validatedMessages 
    } 
  };
}

// Sanitize string to prevent injection
function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim();
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
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(ipRateLimit.resetIn / 1000))
          } 
        }
      );
    }
    
    // Check user-based rate limit (more generous for authenticated users)
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
    // SECURITY: Input Validation & Request Signing
    // ============================================
    let bodyText: string;
    let body: unknown;
    try {
      bodyText = await req.text();
      body = JSON.parse(bodyText);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify request signature to prevent replay attacks
    const signatureResult = await verifyRequestSignature(req, bodyText);
    if (!signatureResult.valid) {
      console.warn(`Request signature verification failed: ${signatureResult.error}`);
      return new Response(
        JSON.stringify({ error: signatureResult.error }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { query, conversationId, messages } = validation.data;
    const sanitizedQuery = sanitize(query);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("Service configuration error");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log("RAG chat query received, length:", sanitizedQuery.length);

    // Step 1: Search for relevant chunks using full-text search
    const { data: searchResults, error: searchError } = await supabase.rpc(
      "search_chunks_fulltext",
      {
        search_query: sanitizedQuery,
        match_count: 5,
      }
    );

    if (searchError) {
      console.error("Search error:", searchError);
    }

    console.log(`Found ${searchResults?.length || 0} relevant chunks`);

    // Step 2: Build context from retrieved chunks
    let context = "";
    let sources: { documentId: string; title: string; rank: number; excerpt: string }[] = [];

    if (searchResults && searchResults.length > 0) {
      context = searchResults
        .map((chunk: { document_title: string; content: string }) => 
          `[Source: ${chunk.document_title}]\n${chunk.content}`
        )
        .join("\n\n---\n\n");
      
      sources = searchResults.map((chunk: { document_id: string; document_title: string; rank: number; content: string }) => ({
        documentId: chunk.document_id,
        title: chunk.document_title,
        rank: chunk.rank,
        excerpt: chunk.content.substring(0, 200) + "...",
      }));
    } else {
      // If no chunks found, try searching documents directly
      const { data: docResults } = await supabase
        .from("rag_documents")
        .select("id, title, content")
        .textSearch("search_vector", sanitizedQuery, { type: "websearch" })
        .limit(3);

      if (docResults && docResults.length > 0) {
        context = docResults
          .map((doc: { title: string; content: string }) => 
            `[Source: ${doc.title}]\n${doc.content.substring(0, 1000)}`
          )
          .join("\n\n---\n\n");
        
        sources = docResults.map((doc: { id: string; title: string; content: string }) => ({
          documentId: doc.id,
          title: doc.title,
          rank: 1,
          excerpt: doc.content.substring(0, 200) + "...",
        }));
      } else {
        context = "No relevant documents found in the knowledge base. Please answer based on your general knowledge about carbon markets and sustainability.";
      }
    }

    // Step 3: Generate response using Lovable AI with context
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
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: sanitizedQuery },
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
      "X-RateLimit-Remaining": String(ipRateLimit.remaining),
    };

    return new Response(response.body, { headers: responseHeaders });
  } catch (error) {
    console.error("Error in rag-chat function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
