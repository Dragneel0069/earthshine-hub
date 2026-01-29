import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Globe2, ChevronDown, TrendingUp, Target, Leaf, FileText, Play } from "lucide-react";
import { EarthGlobe } from "@/components/3d/EarthGlobe";

import { SocialProofStats } from "@/components/landing/SocialProofStats";
import { KnowledgeAgentSection } from "@/components/landing/KnowledgeAgentSection";
import { IndiaHeroSection } from "@/components/landing/IndiaHeroSection";
import { QuickCalculatorWidget } from "@/components/landing/QuickCalculatorWidget";
import { MethodologySection } from "@/components/landing/MethodologySection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SEO } from "@/components/shared/SEO";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";
import heroImage from "@/assets/hero-india-solar.jpg";
import heroVideo from "@/assets/hero-renewable-energy.mp4";
import { Footer } from "@/components/layout/Footer";

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
        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
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
        className="absolute text-primary/30 text-xs font-mono whitespace-nowrap"
        style={{
          left: `${(i * 5) % 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: "-100vh", opacity: [0, 0.6, 0] }}
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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScrollProgress } = useScroll({ 
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax transforms for the globe
  const globeY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const globeScale = useTransform(heroScrollProgress, [0, 1], [1, 0.8]);
  const globeOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0.3]);
  const globeRotate = useTransform(heroScrollProgress, [0, 1], [0, 30]);
  
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <PageTransition>
      <SEO 
        url="/"
        description="India's leading carbon emissions tracking platform. Track, reduce, and offset your organization's carbon footprint with real-time analytics and verified carbon credits."
        keywords="carbon footprint India, carbon credits, emissions tracking, sustainability platform, GHG protocol, BRSR compliance, carbon offset, net zero, climate action"
      />
      <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
        {/* Fixed Navbar over scroll hero */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        {/* Section 1: India-Focused Hero */}
        <main id="main-content">
        <IndiaHeroSection />
        
        {/* Immersive Scroll Expansion Hero */}
        <ScrollExpandMedia
          src={heroVideo}
          poster={heroImage}
          background={heroImage}
          title="India's Path to Net Zero"
          date="Carbon Intelligence Platform"
          scrollToExpand="Scroll to explore"
          textBlend={true}
        >
          {/* Hero CTA Content that appears on scroll */}
          <div className="bg-background/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 max-w-2xl mx-auto border border-border/50 shadow-2xl">
            <motion.div 
              className="inline-flex items-center gap-2 rounded-full glass px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-primary mb-4 md:mb-6"
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
            
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold font-display mb-3 md:mb-4 text-foreground">
              Transform Complex Emissions Data Into 
              <span className="text-primary block mt-1">Actionable Insights</span>
            </h2>
            
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
              AI-powered tracking, real-time analytics, and seamless BRSR compliance for enterprises committed to sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow text-sm md:text-base">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-primary/30 text-foreground hover:bg-primary/10 text-sm md:text-base">
                  <Play className="h-4 w-4" />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </ScrollExpandMedia>

        {/* Traditional Hero Section with 3D Globe */}
        <section ref={heroRef} className="relative py-16 md:py-32 flex items-center overflow-hidden bg-background">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 grid-background opacity-30" />
          
          {/* Green gradient orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/25 rounded-full blur-[100px] md:blur-[180px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-secondary/20 rounded-full blur-[80px] md:blur-[150px]"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          <motion.div 
            className="container relative z-10 px-4 md:px-6"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <ScrollReveal animation="fadeRight">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display tracking-tight mb-4 md:mb-6">
                    <span className="text-foreground">Real-Time </span>
                    <motion.span 
                      className="bg-gradient-to-r from-primary via-secondary to-lime bg-clip-text text-transparent"
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    >
                      Carbon Intelligence
                    </motion.span>
                  </h2>
                  
                  <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0">
                    See your entire carbon footprint at a glance. Our platform helps 500+ Indian companies identify reduction opportunities and track progress toward Net Zero.
                  </p>

                  <ul className="space-y-2 md:space-y-3 text-left max-w-md mx-auto lg:mx-0">
                    {[
                      "Live emissions monitoring across all scopes",
                      "AI-powered anomaly detection",
                      "Automated BRSR compliance reporting",
                      "Carbon credit marketplace integration"
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center gap-2 md:gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-glow flex-shrink-0" />
                        <span className="text-sm md:text-base text-muted-foreground">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* 3D Globe - Hidden on mobile for performance */}
              <motion.div 
                className="relative hidden md:block"
                style={{ 
                  y: globeY, 
                  scale: globeScale, 
                  opacity: globeOpacity,
                  rotateX: globeRotate 
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-secondary/10 to-transparent rounded-full blur-3xl scale-110" />
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <EarthGlobe />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <AnimatedGraphLine />
          </motion.div>
        </section>

        {/* Section 2: The Solution - Data Stream Parallax */}
        <section className="relative py-16 md:py-32 overflow-hidden">
          <DataStream />
          
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <ScrollReveal animation="fadeRight">
                <div className="relative">
                  {/* Dashboard Mockup */}
                  <motion.div 
                    className="relative glass-strong rounded-xl md:rounded-2xl p-1 shadow-glow"
                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  >
                    <div className="bg-card rounded-lg md:rounded-xl p-4 md:p-6 space-y-3 md:space-y-4">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive/50" />
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-warning/50" />
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-success/50" />
                        </div>
                        <span className="text-[10px] md:text-xs text-muted-foreground font-mono">zerograph.in/dashboard</span>
                      </div>
                      
                      {/* Mini charts */}
                      <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {[
                          { label: "Scope 1", value: "450", color: "bg-primary" },
                          { label: "Scope 2", value: "380", color: "bg-secondary" },
                          { label: "Scope 3", value: "720", color: "bg-warning" },
                        ].map((item, i) => (
                          <motion.div 
                            key={i}
                            className="p-2 md:p-3 rounded-lg bg-muted/50"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.color} mb-1.5 md:mb-2`} />
                            <p className="text-[10px] md:text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-sm md:text-lg font-bold font-display">{item.value}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground">tCO₂e</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Graph preview */}
                      <div className="h-20 md:h-32 rounded-lg bg-muted/30 relative overflow-hidden">
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
                        <div className="absolute bottom-1.5 md:bottom-2 right-1.5 md:right-2 text-[10px] md:text-xs text-muted-foreground">
                          Live emissions trend
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fadeLeft" delay={0.2}>
                <div className="space-y-4 md:space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full glass px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-secondary">
                    <Zap className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span>THE SOLUTION</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display">
                    <span className="text-foreground">Real-Time </span>
                    <span className="text-primary">Carbon Intelligence</span>
                  </h2>
                  
                  <p className="text-sm md:text-lg text-muted-foreground">
                    Our platform transforms your complex emissions data into a clear, actionable roadmap. 
                    See your entire carbon footprint at a glance, identify reduction opportunities, 
                    and track progress toward Net Zero.
                  </p>

                  <ul className="space-y-2 md:space-y-4">
                    {[
                      "Live emissions monitoring across all scopes",
                      "AI-powered anomaly detection",
                      "Automated compliance reporting",
                      "Carbon credit marketplace integration"
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center gap-2 md:gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-glow flex-shrink-0" />
                        <span className="text-sm md:text-base text-muted-foreground">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Knowledge Agent Section */}
        <KnowledgeAgentSection />

        {/* Quick Calculator Widget - Lead Magnet */}
        <QuickCalculatorWidget />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Section 3: The Method - Interactive Graph */}
        <section className="relative py-16 md:py-32 overflow-hidden">
          <div className="absolute inset-0 dot-background opacity-30" />
          
          <div className="container relative z-10 px-4 md:px-6">
            <ScrollReveal className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-primary mb-4 md:mb-6">
                <Target className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>PLATFORM FEATURES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display mb-3 md:mb-4">
                <span className="text-foreground">Everything You Need for </span>
                <span className="text-secondary">Net Zero</span>
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground">
                Enterprise-grade tools that 500+ Indian companies use to achieve their sustainability goals.
              </p>
            </ScrollReveal>

            {/* Feature Cards with connecting line */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />
              
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6" staggerDelay={0.15}>
                {features.map((feature, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="group relative"
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                      {/* Connector dot */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-glow hidden lg:block z-10" />
                      
                      <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 h-full transition-all duration-300 group-hover:shadow-glow">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                          <feature.icon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                        </div>
                        <h3 className="text-sm md:text-lg font-bold font-display mb-1 md:mb-2">{feature.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Methodology & Data Sources Section */}
        <MethodologySection />

        {/* Stats Section */}
        <section className="py-12 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
          <div className="container relative z-10 px-4 md:px-6">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="group relative p-4 md:p-6 rounded-xl md:rounded-2xl glass hover:glass-strong transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-primary mb-2 md:mb-4" />
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground mb-0.5 md:mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>


        {/* Social Proof Stats */}
        <SocialProofStats />

        {/* Section 4: CTA - Glass Morphism */}
        <section className="py-16 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
          
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/10 rounded-full blur-[100px] md:blur-[200px]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="container relative z-10 px-4 md:px-6">
            <motion.div 
              className="max-w-2xl mx-auto glass-strong rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-center shadow-glow"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-primary mb-4 md:mb-6">
                <Leaf className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Start Your Journey</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-display mb-3 md:mb-4">
                Ready to Lead the
                <span className="block text-primary">Green Revolution?</span>
              </h2>
              
              <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8">
                Join 500+ forward-thinking Indian companies already transforming their sustainability journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow text-sm md:text-base">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
                <Link to="/consultation" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-primary/30 hover:bg-primary/10 text-sm md:text-base">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;