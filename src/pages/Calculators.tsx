import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calculator,
  ArrowRight,
  TrendingDown,
  Target,
  TreePine,
  Sparkles,
  Building2,
  Factory,
  Leaf
} from "lucide-react";
import { DashboardCalculator } from "@/components/calculators/DashboardCalculator";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { PageTransition } from "@/components/animations/PageTransition";

const nextSteps = [
  { icon: TrendingDown, title: "Create a Reduction Plan", description: "Identify hotspots and create actionable strategies." },
  { icon: Target, title: "Set Science-Based Targets", description: "Align with India's Net Zero and SBTi framework." },
  { icon: TreePine, title: "Offset What You Can't Reduce", description: "Neutralize with verified Indian carbon projects." },
];

const Calculators = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navbar />
        
        {/* Hero Section - Compact */}
        <section className="relative py-16 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 grid-background opacity-20" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div 
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Calculator className="h-4 w-4" />
                <span>GHG Protocol Aligned Calculator</span>
              </motion.div>
              <motion.h1 
                className="text-3xl lg:text-5xl font-bold font-display mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-foreground">Enterprise Carbon</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-lime bg-clip-text text-transparent">
                  Footprint Calculator
                </span>
              </motion.h1>
              <motion.p 
                className="text-muted-foreground max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Comprehensive Scope 1, 2 & 3 emissions tracking with India-specific emission factors. 
                Built for heavy industries including steel, cement, chemicals & more.
              </motion.p>

              {/* Feature Pills */}
              <motion.div 
                className="flex flex-wrap justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {["Steel & Iron", "Cement", "Chemicals", "Aluminum", "Refinery"].map((industry, i) => (
                  <span 
                    key={industry}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-muted/50 text-muted-foreground"
                  >
                    {industry}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard Calculator Section */}
        <section className="py-8 relative">
          <div className="absolute inset-0 dot-background opacity-10" />
          <div className="container relative z-10 max-w-[1600px]">
            <DashboardCalculator />
          </div>
        </section>

        {/* Next Steps */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
          <div className="container relative z-10">
            <ScrollReveal className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span>WHAT'S NEXT</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
                Your <span className="text-primary">Decarbonization</span> Journey
              </h2>
            </ScrollReveal>
            
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-strong text-center border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all h-full">
                    <CardContent className="p-6">
                      <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 p-4 w-fit mx-auto mb-4">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <ScrollReveal className="text-center mt-12">
              <Link to="/consultation">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                  Get Expert Guidance 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative">
          <div className="container">
            <Card className="glass-strong border-primary/20 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/30 to-emerald-500/20">
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
                      <Button className="gap-2 bg-primary hover:bg-primary/90">
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
        <footer className="border-t border-primary/10 py-8 bg-card/50 backdrop-blur-sm">
          <div className="container text-center text-sm text-muted-foreground">
            © 2024 Zero Graph. All rights reserved.
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Calculators;
