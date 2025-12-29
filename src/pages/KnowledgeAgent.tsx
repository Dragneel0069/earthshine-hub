import { Navbar } from "@/components/layout/Navbar";
import { RAGAgent } from "@/components/rag/RAGAgent";
import { PageTransition } from "@/components/animations/PageTransition";

const KnowledgeAgent = () => {
  return (
    <PageTransition>
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
