import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { 
  Upload, 
  BarChart3, 
  TrendingDown, 
  FileCheck,
  Leaf,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Connect Your Data',
    description: 'Upload energy bills, fuel consumption, or connect to your ERP. We support CSV, Excel, and API integrations.',
    features: ['CSV/Excel Upload', 'API Integration', 'Manual Entry'],
    color: 'from-blue-500 to-indigo-600',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Auto-Calculate Emissions',
    description: 'Our engine applies India-specific emission factors to calculate Scope 1, 2, and 3 emissions automatically.',
    features: ['Scope 1, 2, 3 Tracking', 'State-wise Factors', 'Real-time Updates'],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    number: '03',
    icon: TrendingDown,
    title: 'Get AI Insights',
    description: 'Receive AI-powered recommendations for reduction opportunities, cost savings, and target setting.',
    features: ['Reduction Roadmap', 'Cost Analysis', 'Benchmarking'],
    color: 'from-amber-500 to-orange-600',
  },
  {
    number: '04',
    icon: FileCheck,
    title: 'Generate Reports',
    description: 'Export BRSR-compliant reports, CDP disclosures, and custom reports with one click.',
    features: ['BRSR Ready', 'CDP/TCFD', 'Custom Templates'],
    color: 'from-purple-500 to-pink-600',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-20" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-secondary mb-4 md:mb-6">
            <Leaf className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display mb-3 md:mb-4">
            <span className="text-foreground">From Data to </span>
            <span className="text-primary">Decarbonization</span>
            <span className="text-foreground"> in 4 Steps</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground">
            Go from scattered data to actionable climate strategy in minutes, not months.
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-border via-primary/30 to-border z-0" />
              )}
              
              <div className="relative bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-6 h-full hover:shadow-xl transition-all hover:-translate-y-1">
                {/* Step Number */}
                <div className={`absolute -top-2 -left-2 md:-top-3 md:-left-3 w-7 h-7 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-[10px] md:text-sm shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${step.color} bg-opacity-10 flex items-center justify-center mb-3 md:mb-4 mt-2`}>
                  <step.icon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-sm md:text-lg font-bold font-display mb-1 md:mb-2">{step.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-4 line-clamp-3 md:line-clamp-none">{step.description}</p>

                {/* Features */}
                <div className="space-y-1 md:space-y-2 hidden sm:block">
                  {step.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                      <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-sm md:text-base">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/consultation" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-sm md:text-base">
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
