import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, ArrowRight, Zap, Shield, BarChart3, Globe2, ChevronDown } from "lucide-react";
import { EarthGlobe } from "@/components/3d/EarthGlobe";
import { CarbonMolecule } from "@/components/3d/CarbonMolecule";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Indian Companies", icon: Globe2 },
  { value: "₹50Cr+", label: "Cost Savings", icon: Zap },
  { value: "1M+", label: "Tons CO₂ Tracked", icon: BarChart3 },
  { value: "100%", label: "BRSR Compliant", icon: Shield },
];

const features = [
  {
    title: "AI-Powered Tracking",
    description: "Automated emissions monitoring with machine learning algorithms that adapt to your business patterns.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Real-time Analytics",
    description: "Live dashboards with predictive insights and anomaly detection for proactive management.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "BRSR Compliance",
    description: "Auto-generate SEBI-compliant reports with one click. Stay ahead of regulatory requirements.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Carbon Marketplace",
    description: "Trade verified carbon credits from premium Indian projects. Offset with confidence.",
    gradient: "from-purple-500 to-pink-600",
  },
];

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navbar />

        {/* Hero Section - Dark Futuristic */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-b from-foreground via-foreground/95 to-background">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                                 linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          {/* Gradient Orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[150px]"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1,
            }}
          />

          <div className="container relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <motion.div 
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Leaf className="h-4 w-4" />
                  <span>India's Premier Carbon Platform</span>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold font-display tracking-tight mb-6 text-primary-foreground"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  The Future of
                  <motion.span 
                    className="block mt-2 bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Carbon Intelligence
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg lg:text-xl text-primary-foreground/70 mb-10 max-w-xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Transform your sustainability journey with AI-powered emissions tracking, 
                  predictive analytics, and seamless BRSR compliance.
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link to="/signup">
                    <Button size="xl" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
                      Start Free Trial
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="xl" variant="outline" className="w-full sm:w-auto gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      View Demo Dashboard
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
                <EarthGlobe />
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-8 w-8 text-primary-foreground/50" />
            </motion.div>
          </div>
        </section>

        {/* Stats Section - Glass Morphism */}
        <section className="py-20 relative">
          <div className="container">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div 
                    className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <stat.icon className="h-8 w-8 text-primary mb-4" />
                    <p className="text-3xl lg:text-4xl font-bold font-display text-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section className="py-24 relative">
          <div className="container">
            <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
                Redefining Carbon
                <span className="text-primary"> Management</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Enterprise-grade tools designed for the Indian regulatory landscape
              </p>
            </ScrollReveal>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.15}>
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <div
                    className="group relative p-6 rounded-2xl bg-card border border-border hover:border-transparent transition-all duration-500 overflow-hidden h-full"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CO2 Visualization Section */}
        <section className="py-24 bg-gradient-to-b from-background to-card relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)/0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>
          
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal animation="fadeRight">
                <h2 className="text-3xl lg:text-5xl font-bold font-display mb-6">
                  Visualize Your
                  <span className="block text-primary">Carbon Footprint</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our 3D visualization engine transforms complex emissions data into 
                  intuitive, interactive experiences. Understand your impact at a molecular level.
                </p>
                <ul className="space-y-4">
                  {[
                    "Real-time 3D emissions mapping",
                    "Interactive scope breakdown",
                    "Predictive trend analysis",
                    "Customizable dashboards"
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </ScrollReveal>
              
              <ScrollReveal animation="fadeLeft" delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
                  <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border border-border p-8">
                    <CarbonMolecule />
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Interactive CO₂ Molecule Visualization
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Trust Badges */}
        <TrustBadges />

        {/* CTA Section - Bold */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-600 to-teal-600" />
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />
          </div>
          
          <div className="container relative z-10 text-center">
            <ScrollReveal animation="scale">
              <h2 className="text-4xl lg:text-6xl font-bold font-display text-white mb-6">
                Ready to Lead the
                <span className="block">Green Revolution?</span>
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join 500+ forward-thinking Indian companies already transforming their sustainability journey.
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/signup">
                  <Button size="xl" variant="secondary" className="gap-2 text-lg">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/consultation">
                  <Button size="xl" variant="outline" className="gap-2 text-lg border-white text-white hover:bg-white/10">
                    Book a Demo
                  </Button>
                </Link>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-16 bg-card">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-4 mb-12">
              <ScrollReveal delay={0}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-xl">Bharat Carbon</span>
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
                  <li>info@bharatcarbon.in</li>
                  <li>+91 1800-XXX-XXXX</li>
                  <li>Mumbai, India</li>
                </ul>
              </ScrollReveal>
            </div>
            <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 Bharat Carbon. All rights reserved.
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
