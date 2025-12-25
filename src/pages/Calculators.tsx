import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Briefcase, 
  Building2, 
  ArrowRight, 
  TrendingDown,
  Target,
  TreePine,
  Calculator,
  Zap,
  Car,
  Plane,
  Home,
  Factory
} from "lucide-react";
import { IndividualCalculator } from "@/components/calculators/IndividualCalculator";
import { BusinessCalculator } from "@/components/calculators/BusinessCalculator";
import { CorporateCalculator } from "@/components/calculators/CorporateCalculator";
import { QuickCalculator } from "@/components/calculators/QuickCalculators";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { PageTransition } from "@/components/animations/PageTransition";

const calculatorTypes = [
  {
    icon: User,
    title: "Individuals / Households",
    subtitle: "Zero Graph Vita",
    description: "Free online carbon footprint calculator for individuals and families.",
    features: ["Home energy consumption", "Personal transport", "Diet & lifestyle", "Travel emissions"],
    color: "from-info/30 to-info/10",
    popular: false,
    calculatorType: "individual" as const,
  },
  {
    icon: Briefcase,
    title: "Small Companies",
    subtitle: "Zero Graph Lite",
    description: "Affordable carbon tracking for SMEs with Scope 1, 2, and 3 calculations.",
    features: ["Scope 1 & 2 emissions", "Basic Scope 3", "BRSR Lite reports", "GST integration"],
    color: "from-secondary/30 to-secondary/10",
    popular: true,
    calculatorType: "business" as const,
  },
  {
    icon: Building2,
    title: "Larger Corporates",
    subtitle: "Zero Graph Pro",
    description: "Enterprise-grade GHG accounting platform for comprehensive tracking.",
    features: ["Full Scope 1, 2 & 3", "Multi-site tracking", "BRSR compliance", "Supply chain"],
    color: "from-primary/30 to-primary/10",
    popular: false,
    calculatorType: "corporate" as const,
  },
];

const nextSteps = [
  { icon: TrendingDown, title: "Create a Reduction Plan", description: "Identify hotspots and create actionable strategies." },
  { icon: Target, title: "Set Science-Based Targets", description: "Align with India's Net Zero and SBTi framework." },
  { icon: TreePine, title: "Offset What You Can't Reduce", description: "Neutralize with verified Indian carbon projects." },
];

const quickCalculators = [
  { icon: Zap, title: "Electricity", description: "Electricity consumption", type: "electricity" as const },
  { icon: Car, title: "Road Transport", description: "Vehicle emissions", type: "transport" as const },
  { icon: Plane, title: "Air Travel", description: "Flight emissions", type: "airTravel" as const },
  { icon: Home, title: "Building Energy", description: "Office emissions", type: "building" as const },
  { icon: Factory, title: "Industrial", description: "Manufacturing", type: "industrial" as const },
];

const Calculators = () => {
  const renderCalculator = (calc: typeof calculatorTypes[0]) => {
    const trigger = (
      <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
        Start Calculating
        <ArrowRight className="h-4 w-4" />
      </Button>
    );

    switch (calc.calculatorType) {
      case "individual": return <IndividualCalculator trigger={trigger} />;
      case "business": return <BusinessCalculator trigger={trigger} />;
      case "corporate": return <CorporateCalculator trigger={trigger} />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 grid-background opacity-20" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div 
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Calculator className="h-4 w-4" />
                <span>Carbon Calculators</span>
              </motion.div>
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold font-display mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-foreground">Understand Your Impact.</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-lime bg-clip-text text-transparent">
                  India's Path to Net Zero
                </span>
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Our calculators use India-specific emission factors for accurate measurement.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Calculator Types */}
        <section className="py-20 relative">
          <div className="absolute inset-0 dot-background opacity-20" />
          <div className="container relative z-10">
            <ScrollReveal className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
                Choose Your <span className="text-primary">Calculator</span>
              </h2>
            </ScrollReveal>
            
            <StaggerContainer className="grid gap-8 lg:grid-cols-3">
              {calculatorTypes.map((calc, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className={`glass-strong relative overflow-hidden border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all h-full ${calc.popular ? "ring-2 ring-primary/40" : ""}`}>
                      {calc.popular && (
                        <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                          Most Popular
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className={`rounded-xl bg-gradient-to-br ${calc.color} p-4 w-fit mb-4`}>
                          <calc.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl text-foreground">{calc.title}</CardTitle>
                        <p className="text-primary font-medium">{calc.subtitle}</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <p className="text-muted-foreground">{calc.description}</p>
                        <ul className="space-y-2">
                          {calc.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {renderCalculator(calc)}
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Quick Calculators */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container relative z-10">
            <ScrollReveal className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-secondary mb-6">
                <Zap className="h-4 w-4" />
                <span>QUICK TOOLS</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
                Quick <span className="text-secondary">Calculators</span>
              </h2>
            </ScrollReveal>
            
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quickCalculators.map((calc, index) => (
                <StaggerItem key={index}>
                  <QuickCalculator
                    type={calc.type}
                    trigger={
                      <motion.div
                        whileHover={{ y: -5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="glass text-center border-primary/10 hover:border-primary/30 hover:shadow-glow cursor-pointer transition-all">
                          <CardContent className="p-4">
                            <div className="rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10 p-3 w-fit mx-auto mb-3">
                              <calc.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h4 className="font-medium text-sm mb-1 text-foreground">{calc.title}</h4>
                            <p className="text-xs text-muted-foreground">{calc.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    }
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Next Steps */}
        <section className="py-20 relative">
          <div className="absolute inset-0 dot-background opacity-20" />
          <div className="container relative z-10">
            <ScrollReveal className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6">
                <Target className="h-4 w-4" />
                <span>NEXT STEPS</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
                What's <span className="text-primary">Next</span>?
              </h2>
            </ScrollReveal>
            
            <StaggerContainer className="grid gap-8 md:grid-cols-3">
              {nextSteps.map((step, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="glass-strong text-center border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all">
                      <CardContent className="p-6">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 p-4 w-fit mx-auto mb-4">
                          <step.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
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