import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Globe2, ChevronDown, TrendingUp, Target, Leaf, FileText, Play } from "lucide-react";
import { EarthGlobe } from "@/components/3d/EarthGlobe";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "500+", label: "Indian Companies", icon: Globe2 },
  { value: "₹50Cr+", label: "Cost Savings", icon: Zap },
  { value: "1M+", label: "Tons CO₂ Tracked", icon: BarChart3 },
  { value: "100%", label: "BRSR Compliant", icon: Shield },
];

const features = [
  {
    title: "BRSR Automation",
    description: "Auto-generate SEBI-compliant reports with one click",
    icon: FileText,
  },
  {
    title: "Credit Forecasting",
    description: "Predict your carbon credit needs with AI",
    icon: TrendingUp,
  },
  {
    title: "AI Insights",
    description: "Get intelligent recommendations to reduce emissions",
    icon: Zap,
  },
  {
    title: "Net Zero Planning",
    description: "Set and track science-based targets",
    icon: Target,
  },
];

const AnimatedGraphLine = () => (
  <svg 
    className="absolute bottom-0 left-0 w-full h-32 opacity-60"
    viewBox="0 0 1200 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--cyan))" stopOpacity="0" />
        <stop offset="50%" stopColor="hsl(var(--cyan))" stopOpacity="1" />
        <stop offset="100%" stopColor="hsl(var(--neon-green))" stopOpacity="0.5" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <motion.path
      d="M0,80 Q150,60 300,70 T600,40 T900,50 T1200,20"
      fill="none"
      stroke="url(#lineGradient)"
      strokeWidth="3"
      filter="url(#glow)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
  </svg>
);

const DataStream = ({ delay = 0 }: { delay?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-primary/20 text-xs font-mono whitespace-nowrap"
        style={{
          left: `${(i * 5) % 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: "-100vh", opacity: [0, 0.5, 0] }}
        transition={{
          duration: 15 + Math.random() * 10,
          repeat: Infinity,
          delay: delay + i * 0.5,
          ease: "linear",
        }}
      >
        {Math.random() > 0.5 
          ? `CO₂: ${(Math.random() * 1000).toFixed(1)} tCO₂e`
          : `Scope ${Math.ceil(Math.random() * 3)}: ${(Math.random() * 500).toFixed(0)}`
        }
      </motion.div>
    ))}
  </div>
);

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
        <Navbar />

        {/* Section 1: Hero - The Problem */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 grid-background opacity-20" />
          
          {/* Gradient Orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          <motion.div 
            className="container relative z-10 py-20"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <motion.div 
                  className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span>India's Premier Carbon Platform</span>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display tracking-tight mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <span className="text-foreground">Your Path to Net-Zero</span>
                  <br />
                  <span className="text-foreground">is a </span>
                  <motion.span 
                    className="bg-gradient-to-r from-primary via-cyan-glow to-secondary bg-clip-text text-transparent text-glow-cyan"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Complex Graph
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  We help you plot it. Transform complex emissions data into actionable insights with AI-powered tracking and seamless BRSR compliance.
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link to="/signup">
                    <Button size="xl" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow animate-pulse-glow">
                      Start Free Trial
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="xl" variant="outline" className="w-full sm:w-auto gap-2 border-primary/30 text-foreground hover:bg-primary/10 glass">
                      <Play className="h-4 w-4" />
                      View Demo
                    </Button>
                  </Link>
                </motion.div>
              </div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
                  <EarthGlobe />
                </div>
              </motion.div>
            </div>

            <AnimatedGraphLine />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-8 w-8 text-primary/50" />
          </motion.div>
        </section>

        {/* Section 2: The Solution - Data Stream Parallax */}
        <section className="relative py-32 overflow-hidden">
          <DataStream />
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal animation="fadeRight">
                <div className="relative">
                  {/* Dashboard Mockup */}
                  <motion.div 
                    className="relative glass-strong rounded-2xl p-1 shadow-glow"
                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  >
                    <div className="bg-card rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive/50" />
                          <div className="w-3 h-3 rounded-full bg-warning/50" />
                          <div className="w-3 h-3 rounded-full bg-success/50" />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">zerograph.in/dashboard</span>
                      </div>
                      
                      {/* Mini charts */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: "Scope 1", value: "450", color: "bg-primary" },
                          { label: "Scope 2", value: "380", color: "bg-secondary" },
                          { label: "Scope 3", value: "720", color: "bg-warning" },
                        ].map((item, i) => (
                          <motion.div 
                            key={i}
                            className="p-3 rounded-lg bg-muted/50"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className={`w-2 h-2 rounded-full ${item.color} mb-2`} />
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-lg font-bold font-display">{item.value}</p>
                            <p className="text-xs text-muted-foreground">tCO₂e</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Graph preview */}
                      <div className="h-32 rounded-lg bg-muted/30 relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                          <motion.path
                            d="M0,80 C50,70 100,90 150,60 C200,30 250,50 300,40 C350,30 400,45 400,35"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5 }}
                          />
                          <motion.path
                            d="M0,90 C50,85 100,75 150,80 C200,85 250,70 300,75 C350,80 400,65 400,70"
                            fill="none"
                            stroke="hsl(var(--secondary))"
                            strokeWidth="2"
                            strokeDasharray="5 5"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                          />
                        </svg>
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                          Live emissions trend
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fadeLeft" delay={0.2}>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-secondary">
                    <Zap className="h-4 w-4" />
                    <span>THE SOLUTION</span>
                  </div>
                  
                  <h2 className="text-3xl lg:text-5xl font-bold font-display">
                    <span className="text-foreground">Real-Time </span>
                    <span className="text-primary">Carbon Intelligence</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground">
                    Our platform transforms your complex emissions data into a clear, actionable roadmap. 
                    See your entire carbon footprint at a glance, identify reduction opportunities, 
                    and track progress toward Net Zero.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Live emissions monitoring across all scopes",
                      "AI-powered anomaly detection",
                      "Automated compliance reporting",
                      "Carbon credit marketplace integration"
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                        <span className="text-muted-foreground">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Section 3: The Method - Interactive Graph */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 dot-background opacity-30" />
          
          <div className="container relative z-10">
            <ScrollReveal className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6">
                <Target className="h-4 w-4" />
                <span>THE METHOD</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
                <span className="text-foreground">Your Path to </span>
                <span className="text-secondary">Net Zero</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow the proven pathway that 500+ Indian companies use to achieve their sustainability goals.
              </p>
            </ScrollReveal>

            {/* Feature Cards with connecting line */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />
              
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.15}>
                {features.map((feature, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="group relative"
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                      {/* Connector dot */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-glow hidden lg:block z-10" />
                      
                      <div className="glass-strong rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-glow">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <feature.icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold font-display mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
          <div className="container relative z-10">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="group relative p-6 rounded-2xl glass hover:glass-strong transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <stat.icon className="h-8 w-8 text-primary mb-4" />
                    <p className="text-3xl lg:text-4xl font-bold font-display text-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Section 4: CTA - Glass Morphism */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="container relative z-10">
            <motion.div 
              className="max-w-2xl mx-auto glass-strong rounded-3xl p-8 lg:p-12 text-center shadow-glow animate-float"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Leaf className="h-4 w-4" />
                <span>Start Your Journey</span>
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
                Ready to Lead the
                <span className="block text-primary">Green Revolution?</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Join 500+ forward-thinking Indian companies already transforming their sustainability journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="xl" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow animate-pulse-glow">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/consultation">
                  <Button size="xl" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-16 bg-card/30">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-4 mb-12">
              <ScrollReveal delay={0}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-xl">Zero Graph</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  India's leading carbon intelligence platform for enterprises committed to Net Zero.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                  <li><Link to="/calculators" className="hover:text-foreground transition-colors">Calculators</Link></li>
                  <li><Link to="/reports" className="hover:text-foreground transition-colors">Reports</Link></li>
                  <li><Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link to="/consultation" className="hover:text-foreground transition-colors">Contact</Link></li>
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>info@zerograph.in</li>
                  <li>+91 1800-XXX-XXXX</li>
                  <li>Jamshedpur, India</li>
                </ul>
              </ScrollReveal>
            </div>
            <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 Zero Graph. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;