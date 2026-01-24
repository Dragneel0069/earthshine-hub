import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/shared/SEO";
import { PageTransition } from "@/components/animations/PageTransition";
import { AccountingIntegrations } from "@/components/integrations/AccountingIntegrations";

export default function Integrations() {
  return (
    <PageTransition>
      <SEO 
        title="Integrations"
        url="/integrations"
        description="Connect Zero Graph with your accounting software. Native integrations with Tally, Zoho Books, QuickBooks, and more for automated carbon tracking."
        keywords="carbon accounting integrations, Tally integration, Zoho Books carbon tracking, QuickBooks emissions, accounting software ESG"
      />
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <AccountingIntegrations />
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
}
