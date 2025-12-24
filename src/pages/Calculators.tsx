import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
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

const calculatorTypes = [
  {
    icon: User,
    title: "Individuals / Households",
    subtitle: "Bharat Carbon Vita",
    description: "Free online carbon footprint calculator for individuals and families.",
    features: ["Home energy consumption", "Personal transport", "Diet & lifestyle", "Travel emissions"],
    color: "bg-info",
    popular: false,
    calculatorType: "individual" as const,
  },
  {
    icon: Briefcase,
    title: "Small Companies",
    subtitle: "Bharat Carbon Lite",
    description: "Affordable carbon tracking for SMEs with Scope 1, 2, and 3 calculations.",
    features: ["Scope 1 & 2 emissions", "Basic Scope 3", "BRSR Lite reports", "GST integration"],
    color: "bg-secondary",
    popular: true,
    calculatorType: "business" as const,
  },
  {
    icon: Building2,
    title: "Larger Corporates",
    subtitle: "Bharat Carbon Pro",
    description: "Enterprise-grade GHG accounting platform for comprehensive tracking.",
    features: ["Full Scope 1, 2 & 3", "Multi-site tracking", "BRSR compliance", "Supply chain"],
    color: "bg-primary",
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
      <Button className="w-full gap-2">
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Calculator className="h-4 w-4" />
              <span>Carbon Calculators</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-display mb-6">
              Understand Your Impact. Start Your Journey to Net Zero
            </h1>
            <p className="text-lg text-muted-foreground">
              Our calculators use India-specific emission factors for accurate measurement.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold font-display text-center mb-12">Choose Your Calculator</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {calculatorTypes.map((calc, index) => (
              <Card key={index} className={`group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2 ${calc.popular ? "border-primary ring-2 ring-primary/20" : ""}`}>
                {calc.popular && <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">Most Popular</div>}
                <CardHeader className="pb-4">
                  <div className={`${calc.color} rounded-xl p-4 w-fit mb-4 transition-transform group-hover:scale-110`}>
                    <calc.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{calc.title}</CardTitle>
                  <p className="text-primary font-medium">{calc.subtitle}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{calc.description}</p>
                  <ul className="space-y-2">
                    {calc.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {renderCalculator(calc)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold font-display text-center mb-8">Quick Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickCalculators.map((calc, index) => (
              <QuickCalculator
                key={index}
                type={calc.type}
                trigger={
                  <Card className="text-center transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto mb-3">
                        <calc.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-medium text-sm mb-1">{calc.title}</h4>
                      <p className="text-xs text-muted-foreground">{calc.description}</p>
                    </CardContent>
                  </Card>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold font-display text-center mb-12">What's Next?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {nextSteps.map((step, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="rounded-xl bg-primary/10 p-4 w-fit mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/consultation">
              <Button size="lg" className="gap-2">Get Expert Guidance <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 bg-card">
        <div className="container text-center text-sm text-muted-foreground">© 2024 Bharat Carbon. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Calculators;
