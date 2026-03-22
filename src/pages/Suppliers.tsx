import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/shared/SEO';
import { SupplierPortal } from '@/components/suppliers/SupplierPortal';
import { VendorSurvey } from '@/components/suppliers/VendorSurvey';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, FileText } from 'lucide-react';

export default function Suppliers() {
  return (
    <SEO 
        title="Supply Chain & Vendor Surveys" 
        description="Manage your supply chain emissions, track Scope 3 data from suppliers, and collect emission data through vendor surveys" 
        url="/suppliers"
      />
      <Navbar />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Supply Chain Management</h1>
            <p className="text-muted-foreground">
              Manage suppliers, collect emissions data, and track Scope 3 emissions across your value chain
            </p>
          </div>

          <Tabs defaultValue="suppliers" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="suppliers" className="gap-2">
                <Building2 className="h-4 w-4" />
                Supplier Portal
              </TabsTrigger>
              <TabsTrigger value="surveys" className="gap-2">
                <FileText className="h-4 w-4" />
                Vendor Surveys
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers">
              <SupplierPortal />
            </TabsContent>

            <TabsContent value="surveys">
              <VendorSurvey />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
  );
}
