import { Calculator, Target, TrendingDown, Leaf, Megaphone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const pathwaySteps = [
  {
    icon: Calculator,
    title: "Calculate",
    description: "Measure your carbon footprint accurately",
    items: ["Organisations", "SMEs", "Products", "Events", "Individuals"],
    href: "/calculators",
    color: "bg-primary",
  },
  {
    icon: Target,
    title: "Target",
    description: "Set science-based reduction targets",
    items: ["Net Zero Goals", "SBTi Alignment", "BRSR Targets"],
    href: "/solutions",
    color: "bg-secondary",
  },
  {
    icon: TrendingDown,
    title: "Reduce",
    description: "Implement reduction strategies",
    items: ["Energy Efficiency", "Process Optimization", "Supply Chain"],
    href: "/solutions",
    color: "bg-info",
  },
  {
    icon: Leaf,
    title: "Offset",
    description: "Neutralize unavoidable emissions",
    items: ["Verified Projects", "Indian Projects", "Tree Planting"],
    href: "/marketplace",
    color: "bg-success",
  },
  {
    icon: Megaphone,
    title: "Communicate",
    description: "Share your sustainability story",
    items: ["Green Claims", "Stakeholder Reports", "ESG Disclosure"],
    href: "/reports",
    color: "bg-warning",
  },
  {
    icon: ShieldCheck,
    title: "Comply",
    description: "Meet regulatory requirements",
    items: ["BRSR", "CDP", "GRI", "ISO 14064"],
    href: "/reports",
    color: "bg-destructive",
  },
];

export function PathwaySection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            Your Proven Pathway to Net Zero
          </h2>
          <p className="text-muted-foreground text-lg">
            Our methodology is guided by a clear, robust six-step process. This is the journey we take all Indian businesses on, from initial calculation to full compliance.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {pathwaySteps.map((step, index) => (
            <Link
              key={index}
              to={step.href}
              className="group relative bg-card rounded-xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30"
            >
              <div className={`${step.color} rounded-xl p-3 w-fit mb-4 transition-transform group-hover:scale-110`}>
                <step.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <ul className="space-y-1">
                {step.items.map((item, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-primary font-medium">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
