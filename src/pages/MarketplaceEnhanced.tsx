import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/shared/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Leaf, Award, FileText, Shield, AlertTriangle } from "lucide-react";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";
import { MyOrders } from "@/components/marketplace/MyOrders";
import { useAuth } from "@/hooks/useAuth";
export default function MarketplaceEnhanced() {
  const { user } = useAuth();

  return (
    <SEO 
        title="Carbon Credit Marketplace | Zero Graph"
        description="Browse and purchase verified carbon credits with quality scoring. Verra, Gold Standard certified projects from India."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div 
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px]"
          />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div 
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Carbon Credit Marketplace</span>
              </div>
              <motion.h1 
                className="text-3xl lg:text-5xl font-bold mb-4"
              >
                <span>Verified Indian </span>
                <span className="bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
                  Carbon Credits
                </span>
              </motion.h1>
              <motion.p 
                className="text-muted-foreground mb-8"
              >
                Quality-scored credits with full traceability and audit-ready retirement certificates
              </motion.p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { label: 'Projects', value: '50+', icon: Leaf },
                  { label: 'Credits Available', value: '2M+', icon: Award },
                  { label: 'Registries', value: '4', icon: Shield },
                  { label: 'Avg. Quality', value: '78/100', icon: FileText },
                ].map((stat, i) => (
                  <Card key={i} className="bg-background/50 backdrop-blur-sm">
                    <CardContent className="pt-4 text-center">
                      <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Banner */}
        <div className="bg-yellow-50 border-y border-yellow-200 py-3">
          <div className="container flex items-center gap-2 text-sm text-yellow-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p>
              <strong>Disclaimer:</strong> Carbon credits represent verified emission reductions by third-party projects. 
              Purchasing credits does not eliminate your emissions and should complement direct reduction efforts.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="container py-8">
          <Tabs defaultValue="browse">
            <TabsList className="mb-6">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Browse Credits
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Orders
                {user && <Badge variant="secondary" className="ml-1">New</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <MarketplaceListings />
            </TabsContent>

            <TabsContent value="orders">
              <MyOrders />
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
  );
}
