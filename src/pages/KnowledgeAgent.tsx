import { Navbar } from "@/components/layout/Navbar";
import { RAGAgent } from "@/components/rag/RAGAgent";
import { PageTransition } from "@/components/animations/PageTransition";
import { SEO } from "@/components/shared/SEO";

const KnowledgeAgent = () => {
  return (
    <PageTransition>
      <SEO 
        title="Sustainability Knowledge Agent"
        url="/knowledge"
        description="Ask questions about carbon emissions, sustainability practices, and climate regulations. Get AI-powered answers from our knowledge base."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <RAGAgent />
        </main>
      </div>
    </PageTransition>
  );
};

export default KnowledgeAgent;
