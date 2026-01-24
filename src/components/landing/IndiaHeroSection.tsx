import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingDown, Building2, Leaf, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const IndiaHeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-background opacity-20" />
      <motion.div 
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="outline" className="gap-2 px-4 py-2 text-sm bg-card">
                <span className="text-lg">🇮🇳</span>
                <span>India's Carbon Intelligence Platform</span>
              </Badge>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold font-display leading-tight">
                <span className="text-foreground">India's Climate</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Action Operating System
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
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
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted border border-border"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/signup">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/calculators">
                <Button size="lg" variant="outline" className="gap-2">
                  Calculate Emissions
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6 pt-4 border-t border-border"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">500+ companies</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1M+ tons</span> CO₂ tracked
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
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
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative z-10">
                  <div className={`text-3xl font-bold font-display bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-foreground mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* India-specific callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 p-6 rounded-2xl bg-primary/5 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                Built for India's Climate Ambitions
              </h3>
              <p className="text-sm text-muted-foreground">
                Aligned with India's net-zero 2070 target, BRSR framework, and CEA emission factors. 
                Supporting MSMEs, startups, and large enterprises in their decarbonization journey.
              </p>
            </div>
            <Link to="/about">
              <Button variant="outline" className="gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
