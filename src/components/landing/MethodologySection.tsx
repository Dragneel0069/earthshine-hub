import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  FileText, 
  Database, 
  ArrowRight,
  BookOpen,
  Scale,
  Globe2,
  BadgeCheck
} from 'lucide-react';

const methodologyPoints = [
  {
    icon: ShieldCheck,
    title: 'GHG Protocol Compliant',
    description: 'Full alignment with international greenhouse gas accounting standards for Scope 1, 2, and 3 emissions.',
  },
  {
    icon: Database,
    title: 'India-Specific Data',
    description: 'CEA grid emission factors, state-wise calculations, and industry benchmarks specific to Indian operations.',
  },
  {
    icon: Scale,
    title: 'BRSR & SEBI Ready',
    description: 'Reports formatted to meet SEBI BRSR requirements for listed Indian companies.',
  },
  {
    icon: Globe2,
    title: 'Multi-Standard Support',
    description: 'Compatible with CDP, TCFD, GRI, and other international reporting frameworks.',
  },
];

const dataSources = [
  { name: 'Central Electricity Authority (CEA)', type: 'Grid Emission Factors' },
  { name: 'IPCC Guidelines', type: 'Emission Calculations' },
  { name: 'DEFRA', type: 'Fuel Emission Factors' },
  { name: 'GHG Protocol', type: 'Methodology Framework' },
  { name: 'Bureau of Energy Efficiency', type: 'PAT Scheme Data' },
  { name: 'Ministry of Environment', type: 'Indian Standards' },
];

export function MethodologySection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Methodology Overview */}
          <div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary">
                <BookOpen className="h-4 w-4" />
                <span>TRANSPARENT METHODOLOGY</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold font-display">
                <span className="text-foreground">Built on </span>
                <span className="text-primary">Verified Science</span>
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Our calculations follow internationally recognized standards, adapted for 
                Indian operations. Every emission factor is sourced, documented, and auditable.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {methodologyPoints.map((point, index) => (
                  <div
                    key={point.title}
                    className="p-4 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <point.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{point.title}</h4>
                        <p className="text-xs text-muted-foreground">{point.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/methodology">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  View Full Methodology
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Data Sources */}
          <div>
            <div
              className="glass-strong rounded-2xl p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <BadgeCheck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Authoritative Data Sources</h3>
                  <p className="text-sm text-muted-foreground">
                    Our emission factors come from trusted institutions
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {dataSources.map((source, index) => (
                  <div
                    key={source.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium text-sm">{source.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                      {source.type}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  All emission factors are updated annually and aligned with the latest 
                  CEA CO₂ baseline database and IPCC guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
