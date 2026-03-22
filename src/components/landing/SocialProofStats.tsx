import { useRef, useEffect, useState } from "react";
import { Building2, Leaf, Globe2, TrendingDown, Users, Award } from "lucide-react";

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  icon: React.ElementType;
  delay?: number;
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(easeOutQuart * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

function StatItem({ value, suffix, prefix, label, description, icon: Icon, delay = 0 }: StatItemProps) {
  return (
    <div
      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        
        <div className="text-4xl md:text-5xl font-bold font-display text-foreground mb-2">
          <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
        </div>
        
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

const stats = [
  {
    value: 500,
    suffix: "+",
    label: "Companies",
    description: "Indian businesses trust Zero Graph for carbon management",
    icon: Building2,
  },
  {
    value: 2,
    suffix: "M+",
    label: "tCO₂e Tracked",
    description: "Tonnes of emissions measured and monitored",
    icon: TrendingDown,
  },
  {
    value: 150,
    suffix: "K+",
    label: "Credits Retired",
    description: "Verified carbon credits retired for our clients",
    icon: Leaf,
  },
  {
    value: 28,
    label: "States Covered",
    description: "Emission factors across all Indian states",
    icon: Globe2,
  },
];

const trustedBy = [
  "Tata Group",
  "Mahindra",
  "Infosys",
  "Wipro",
  "L&T",
  "Reliance",
  "Adani",
  "JSW",
];

export function SocialProofStats() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Trusted Platform
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            Powering India's Net Zero Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join hundreds of Indian companies using Zero Graph to measure, reduce, and offset their carbon footprint.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Trusted By Logos */}
        <div
          className="pt-8 border-t border-border"
        >
          <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-6">
            Trusted by India's Leading Enterprises
          </p>
          
          <div className="relative overflow-hidden">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            
            {/* Scrolling logos */}
            <div
              className="flex gap-12 items-center"
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {[...trustedBy, ...trustedBy].map((company, index) => (
                <span
                  key={`${company}-${index}`}
                  className="text-xl font-display font-semibold text-muted-foreground/50 whitespace-nowrap hover:text-foreground transition-colors"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications Row */}
        <div
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          {[
            { label: "ISO 14064", sublabel: "Certified" },
            { label: "GHG Protocol", sublabel: "Aligned" },
            { label: "SEBI BRSR", sublabel: "Compliant" },
            { label: "CDP Partner", sublabel: "Accredited" },
          ].map((cert) => (
            <div
              key={cert.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border"
            >
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{cert.label}</span>
              <span className="text-xs text-muted-foreground">• {cert.sublabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
