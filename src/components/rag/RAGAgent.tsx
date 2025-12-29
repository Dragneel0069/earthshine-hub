import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, FileText, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RAGChat } from "./RAGChat";
import { DocumentManager } from "./DocumentManager";
import { supabase } from "@/integrations/supabase/client";

interface Document {
  id: string;
  title: string;
  source_type: string;
  created_at: string;
  content: string;
}

export function RAGAgent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const { data, error } = await supabase
        .from("rag_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Sidebar - Document Manager */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 0 : 380 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative border-r border-border/50 bg-card/30 overflow-hidden flex-shrink-0"
      >
        <div className="w-[380px] h-full">
          <DocumentManager
            documents={documents}
            onDocumentsChange={fetchDocuments}
            isLoading={isLoadingDocs}
          />
        </div>
      </motion.div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-[368px] top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full glass-strong border border-border/50 transition-all duration-300"
        style={{ left: sidebarCollapsed ? 12 : 368 }}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background/50">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold">Carbon Knowledge Agent</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered Q&A for carbon markets & sustainability
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{documents.length} documents</span>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <RAGChat />
        </div>
      </div>
    </div>
  );
}
