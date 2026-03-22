import { Navbar } from "@/components/layout/Navbar";
import { RAGAgent } from "@/components/rag/RAGAgent";
import { SEO } from "@/components/shared/SEO";

const KnowledgeAgent = () => {
  return (
    <>
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
      </>

      </>


  );
};

export default KnowledgeAgent;
