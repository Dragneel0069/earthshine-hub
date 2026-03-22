import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingDown, Building2, Leaf, FileCheck } from 'lucide-react';
export const IndiaHeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background pt-20 md:pt-0">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-background opacity-20" />
      <div 
        className="absolute top-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[100px] md:blur-[150px]"
      />
      
      <div className="container relative z-10 py-8 md:py-20 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div
            className="space-y-5 md:space-y-8"
          >
            {/* Badge */}
            <div
            >
              <Badge variant="outline" className="gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-card">
                <span className="text-base md:text-lg">🇮🇳</span>
                <span>India's Carbon Intelligence Platform</span>
              </Badge>
            </div>

            {/* Headline */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-display leading-tight">
                <span className="text-foreground">India's Climate</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Action Operating System
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                Enterprise-grade carbon accounting, BRSR compliance, and decarbonization intelligence 
                built for Indian industries. From MSMEs to large enterprises.
              </p>
            </div>

            {/* Key Features Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: FileCheck, text: 'BRSR Ready' },
                { icon: TrendingDown, text: 'Net Zero Pathways' },
                { icon: Building2, text: 'India-Specific Data' },
                { icon: Leaf, text: 'Carbon Credits' },
              ].map((item, index) => (
                <div
                  key={item.text}
                  className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full bg-muted border border-border"
                >
                  <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                  <span className="text-xs md:text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-xl transition-shadow text-sm md:text-base">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/calculators" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-sm md:text-base">
                  Calculate Emissions
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 pt-4 border-t border-border"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">500+ companies</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <div className="text-xs md:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1M+ tons</span> CO₂ tracked
              </div>
            </div>
          </div>

          {/* Right Content - Stats Grid */}
          <div
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            {[
              {
                value: '₹50Cr+',
                label: 'Cost Savings',
                description: 'Unlocked for clients',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                value: '100%',
                label: 'BRSR Compliant',
                description: 'SEBI-aligned reports',
                color: 'from-blue-500 to-indigo-600',
              },
              {
                value: '30%',
                label: 'Avg. Reduction',
                description: 'In 12 months',
                color: 'from-amber-500 to-orange-600',
              },
              {
                value: '24/7',
                label: 'Real-time Tracking',
                description: 'Emissions monitoring',
                color: 'from-purple-500 to-pink-600',
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-card border border-border p-4 md:p-6 hover:shadow-lg transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative z-10">
                  <div className={`text-xl sm:text-2xl md:text-3xl font-bold font-display bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-foreground mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* India-specific callout */}
        <div
          className="mt-8 md:mt-16 p-4 md:p-6 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-base md:text-lg mb-1">
                Built for India's Climate Ambitions
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Aligned with India's net-zero 2070 target, BRSR framework, and CEA emission factors. 
                Supporting MSMEs, startups, and large enterprises in their decarbonization journey.
              </p>
            </div>
            <Link to="/about" className="w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto gap-2 text-sm">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
