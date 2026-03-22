import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Calculator,
  ArrowRight,
  TrendingDown,
  Target,
  TreePine,
  Sparkles,
  Building2,
  Factory,
  Leaf,
  Zap,
  Car,
  Package
} from "lucide-react";
import { DashboardCalculator } from "@/components/calculators/DashboardCalculator";
import { EnergyCalculator } from "@/components/calculators/EnergyCalculator";
import { TransportCalculator } from "@/components/calculators/TransportCalculator";
import { SupplyChainCalculator } from "@/components/calculators/SupplyChainCalculator";
import { SEO } from "@/components/shared/SEO";

const nextSteps = [
  { icon: TrendingDown, title: "Create a Reduction Plan", description: "Identify hotspots and create actionable strategies." },
  { icon: Target, title: "Set Science-Based Targets", description: "Align with India's Net Zero and SBTi framework." },
  { icon: TreePine, title: "Offset What You Can't Reduce", description: "Neutralize with verified Indian carbon projects." },
];

const Calculators = () => {
  return (
    <>
      <SEO 
        title="Carbon Footprint Calculator"
        url="/calculators"
        description="Calculate your organization's carbon footprint with India-specific emission factors. Comprehensive Scope 1, 2 & 3 emissions tracking aligned with GHG Protocol."
        keywords="carbon footprint calculator India, GHG emissions calculator, Scope 1 2 3 emissions, corporate carbon calculator, enterprise emissions tracking"
      />
      <div className="min-h-screen bg-background overflow-hidden">
        <Navbar />
        
        {/* Hero Section - Compact */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-b from-muted to-background">
          {/* Background effects */}
          <div className="absolute inset-0 grid-background opacity-20" />
          <div 
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]"
          />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div 
                className="inline-flex items-center gap-2 rounded-full bg-accent border border-border px-4 py-2 text-sm font-medium text-primary mb-4"
              >
                <Calculator className="h-4 w-4" />
                <span>GHG Protocol Aligned Calculator</span>
              </div>
              <h1 
                className="text-3xl lg:text-5xl font-bold font-display mb-4"
              >
                <span className="text-foreground">Enterprise Carbon</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Footprint Calculator
                </span>
              </h1>
              <p 
                className="text-muted-foreground max-w-xl mx-auto"
              >
                Comprehensive Scope 1, 2 & 3 emissions tracking with India-specific emission factors. 
                Built for heavy industries including steel, cement, chemicals & more.
              </p>

              {/* Feature Pills */}
              <div 
                className="flex flex-wrap justify-center gap-2 mt-6"
              >
                {["Steel & Iron", "Cement", "Chemicals", "Aluminum", "Refinery"].map((industry, i) => (
                  <span 
                    key={industry}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Tabs Section */}
        <section className="py-8 relative bg-muted/30">
          <div className="container relative z-10 max-w-[1600px]">
            <Tabs defaultValue="comprehensive" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="comprehensive" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Comprehensive</span>
                </TabsTrigger>
                <TabsTrigger value="energy" className="gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Energy</span>
                </TabsTrigger>
                <TabsTrigger value="transport" className="gap-2">
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Transport</span>
                </TabsTrigger>
                <TabsTrigger value="supply-chain" className="gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Supply Chain</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comprehensive">
                <DashboardCalculator />
              </TabsContent>

              <TabsContent value="energy">
                <EnergyCalculator />
              </TabsContent>

              <TabsContent value="transport">
                <TransportCalculator />
              </TabsContent>

              <TabsContent value="supply-chain">
                <SupplyChainCalculator />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Next Steps */}
        <section className="py-20 relative bg-background">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent" />
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent border border-border px-4 py-2 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span>WHAT'S NEXT</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
                Your <span className="text-primary">Decarbonization</span> Journey
              </h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                >
                  <Card className="text-center bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all h-full">
                    <CardContent className="p-6">
                      <div className="rounded-xl bg-accent p-4 w-fit mx-auto mb-4">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/consultation">
                <Button size="lg" className="gap-2 shadow-lg">
                  Get Expert Guidance 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative bg-muted/50">
          <div className="container">
            <Card className="bg-card border border-border shadow-lg overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-accent">
                      <Building2 className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">Need a detailed GHG inventory?</h3>
                      <p className="text-muted-foreground">Our experts can help you with BRSR, CDP, and other compliance requirements.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to="/reports">
                      <Button variant="outline" className="gap-2">
                        <Factory className="h-4 w-4" />
                        BRSR Reports
                      </Button>
                    </Link>
                    <Link to="/marketplace">
                      <Button className="gap-2">
                        <Leaf className="h-4 w-4" />
                        Carbon Offsets
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 bg-card">
          <div className="container text-center text-sm text-muted-foreground">
            © 2024 Zero Graph. All rights reserved.
          </div>
        </footer>
      </div>
      </>

  

  );
};

export default Calculators;
