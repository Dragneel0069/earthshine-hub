import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Loader2, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { signRequest, getSignedHeaders } from "@/lib/requestSigning";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SmartSuggestions } from "./SmartSuggestions";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    documentId: string;
    title: string;
    similarity: number;
    excerpt: string;
  }>;
}

interface RAGChatProps {
  conversationId?: string;
}

export function RAGChat({ conversationId }: RAGChatProps) {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Please log in to access the Carbon Knowledge Assistant. Your conversations will be saved securely.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const trimmedInput = input.trim();
    
    // Input validation
    if (!trimmedInput || isLoading) return;
    if (trimmedInput.length > 1000) {
      toast.error("Query is too long. Please limit to 1000 characters.");
      return;
    }
    
    // Sanitize input
    const sanitizedInput = trimmedInput.replace(/[<>]/g, "");

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: sanitizedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";
    const assistantId = (Date.now() + 1).toString();

    try {
      const payload = {
        query: userMessage.content,
        conversationId,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      };
      
      // Sign the request to prevent replay attacks
      const signedRequest = await signRequest(payload);
      
      // Get the current session token
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentSession?.access_token || ""}`,
            ...getSignedHeaders(signedRequest),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
          throw new Error("Rate limit exceeded");
        }
        if (response.status === 402) {
          toast.error("AI usage limit reached. Please add credits.");
          throw new Error("Payment required");
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      // Get sources from header
      const sourcesHeader = response.headers.get("X-RAG-Sources");
      const sources = sourcesHeader ? JSON.parse(sourcesHeader) : [];

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      // Add initial assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", sources },
      ]);

      let buffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      if (!assistantContent) {
        toast.error("Failed to get response. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div
              className="py-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Carbon Knowledge Assistant</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Ask questions about carbon markets, BRSR compliance, CBAM regulations, 
                  and sustainability reporting. I'll search our knowledge base to help you.
                </p>
              </div>
              
              {/* Smart Suggestions */}
              <SmartSuggestions
                onSuggestionClick={(suggestion) => {
                  setInput(suggestion);
                  textareaRef.current?.focus();
                }}
                className="max-w-xl mx-auto"
              />
            </div>
          )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass-strong"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  
                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-secondary/80"
                            title={source.excerpt}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {source.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="glass-strong rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about carbon markets, credits, or sustainability..."
              className="min-h-[60px] max-h-[200px] pr-12 resize-none bg-background/50"
              disabled={isLoading}
              maxLength={1000}
            />
            <div className="absolute right-14 bottom-3 text-xs text-muted-foreground">
              {input.length}/1000
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
