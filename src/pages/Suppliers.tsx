import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/shared/SEO';
import { PageTransition } from '@/components/animations/PageTransition';
import { SupplierPortal } from '@/components/suppliers/SupplierPortal';

export default function Suppliers() {
  return (
    <PageTransition>
      <SEO 
        title="Supplier Portal | Zero Graph" 
        description="Manage your supply chain emissions and track Scope 3 data from suppliers" 
      />
      <Navbar />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Supply Chain Portal</h1>
            <p className="text-muted-foreground">
              Collect emissions data from your suppliers and track Scope 3 emissions across your value chain
            </p>
          </div>

          <SupplierPortal />
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
}
