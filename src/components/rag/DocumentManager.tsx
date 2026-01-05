import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Loader2, 
  CheckCircle2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { addTextDocumentSchema, addUrlDocumentSchema } from "@/lib/validation";
import { signRequest, getSignedHeaders } from "@/lib/requestSigning";

interface Document {
  id: string;
  title: string;
  source_type: string;
  created_at: string;
  content: string;
}

interface DocumentManagerProps {
  documents: Document[];
  onDocumentsChange: () => void;
  isLoading: boolean;
}

export function DocumentManager({ documents, onDocumentsChange, isLoading }: DocumentManagerProps) {
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const processDocument = async (docContent: string, docTitle: string, sourceType: string, sourceUrl?: string) => {
    try {
      const payload = {
        content: docContent,
        title: docTitle,
        sourceType,
        sourceUrl,
      };
      
      // Sign the request to prevent replay attacks
      const signedRequest = await signRequest(payload);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-embed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            ...getSignedHeaders(signedRequest),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Processing failed: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error processing document:", error);
      throw error;
    }
  };

  const handleAddText = async () => {
    // Validate with schema
    const result = addTextDocumentSchema.safeParse({ title, content });
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError?.message || "Validation error");
      return;
    }

    setIsProcessing(true);
    try {
      await processDocument(result.data.content, result.data.title, "text");
      toast.success("Document added and processed successfully");
      setTitle("");
      setContent("");
      setIsAddingDoc(false);
      onDocumentsChange();
    } catch (error) {
      toast.error("Failed to process document");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddUrl = async () => {
    // Validate with schema
    const result = addUrlDocumentSchema.safeParse({ title, url });
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError?.message || "Validation error");
      return;
    }

    setIsProcessing(true);
    try {
      // For now, we'll just store the URL reference
      toast.info("URL document added. Content scraping coming soon.");
      const { error } = await supabase.from("rag_documents").insert({
        title: result.data.title,
        source_type: "url",
        source_url: result.data.url,
        content: `Content from: ${result.data.url}`,
      });

      if (error) throw error;

      setTitle("");
      setUrl("");
      setIsAddingDoc(false);
      onDocumentsChange();
    } catch (error) {
      toast.error("Failed to add URL document");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    
    // File size validation (100KB max)
    const MAX_FILE_SIZE = 100 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 100KB.");
      return;
    }
    
    // File type validation
    const allowedTypes = [".txt", ".md", ".json"];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(fileExtension)) {
      toast.error("Invalid file type. Only .txt, .md, and .json files are allowed.");
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      
      // Validate content length
      if (text.length > 100000) {
        toast.error("File content is too large. Maximum 100KB of text.");
        return;
      }
      
      const docTitle = (title.trim() || file.name).replace(/[<>]/g, "").substring(0, 255);
      await processDocument(text, docTitle, "file");
      toast.success("File uploaded and processed successfully");
      setFile(null);
      setTitle("");
      setIsAddingDoc(false);
      onDocumentsChange();
    } catch (error) {
      toast.error("Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      const { error } = await supabase
        .from("rag_documents")
        .delete()
        .eq("id", docId);

      if (error) throw error;

      toast.success("Document deleted");
      onDocumentsChange();
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleReprocess = async (doc: Document) => {
    setProcessingId(doc.id);
    try {
      const payload = {
        documentId: doc.id,
        content: doc.content,
        title: doc.title,
        sourceType: doc.source_type,
      };
      
      // Sign the request to prevent replay attacks
      const signedRequest = await signRequest(payload);
      
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-embed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            ...getSignedHeaders(signedRequest),
          },
          body: JSON.stringify(payload),
        }
      );
      toast.success("Document reprocessed successfully");
    } catch (error) {
      toast.error("Failed to reprocess document");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Knowledge Base</h2>
          <p className="text-sm text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        
        <Dialog open={isAddingDoc} onOpenChange={setIsAddingDoc}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Document to Knowledge Base</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="text" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-1">
                  <Input
                    placeholder="Document title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                  />
                  <p className="text-xs text-muted-foreground text-right">{title.length}/255</p>
                </div>
                <div className="space-y-1">
                  <Textarea
                    placeholder="Paste your document content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px]"
                    maxLength={100000}
                  />
                  <p className="text-xs text-muted-foreground text-right">{content.length}/100000</p>
                </div>
                <Button 
                  onClick={handleAddText} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Document"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="file" className="space-y-4 mt-4">
                <Input
                  placeholder="Document title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".txt,.md,.json"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : "Click to upload .txt, .md, or .json files"}
                    </p>
                  </label>
                </div>
                <Button 
                  onClick={handleFileUpload} 
                  disabled={isProcessing || !file}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Upload & Process"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="url" className="space-y-4 mt-4">
                <Input
                  placeholder="Document title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={255}
                />
                <Input
                  placeholder="https://example.com/document"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  maxLength={2048}
                />
                <Button 
                  onClick={handleAddUrl} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add URL"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Document List */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No documents yet</p>
            <p className="text-sm text-muted-foreground/75">
              Add documents to build your knowledge base
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 glass-strong">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <h3 className="font-medium truncate">{doc.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {doc.source_type}
                        </Badge>
                        <span>
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleReprocess(doc)}
                        disabled={processingId === doc.id}
                      >
                        {processingId === doc.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
