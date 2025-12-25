import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Target, 
  Users, 
  Award, 
  Globe,
  TrendingUp,
  Shield,
  Heart,
  ArrowRight
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { PageTransition } from "@/components/animations/PageTransition";

const values = [
  {
    icon: Target,
    title: "Accuracy",
    description: "We use India-specific emission factors and validated methodologies to ensure your carbon data is precise and reliable.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We partner only with verified offset projects and maintain the highest standards of transparency in all our work.",
  },
  {
    icon: Heart,
    title: "Impact",
    description: "Every action we take is measured by its real-world impact on reducing emissions and supporting communities.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We work alongside our clients as trusted partners, providing ongoing support throughout their sustainability journey.",
  },
];

const stats = [
  { value: "500+", label: "Companies Served" },
  { value: "1M+", label: "Tonnes CO₂ Tracked" },
  { value: "50,000+", label: "Credits Retired" },
  { value: "15+", label: "Indian States" },
];

const team = [
  {
    name: "Dr. Priya Sharma",
    role: "CEO & Founder",
    description: "Former TERI researcher with 15+ years in sustainability consulting",
  },
  {
    name: "Rajesh Kumar",
    role: "Chief Technology Officer",
    description: "Ex-Infosys, leading our carbon tracking platform development",
  },
  {
    name: "Anita Desai",
    role: "Head of Consulting",
    description: "CDP-certified consultant specializing in BRSR compliance",
  },
  {
    name: "Vikram Singh",
    role: "Director of Partnerships",
    description: "Building relationships with carbon project developers across India",
  },
];

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-hidden">
        <Navbar />
        
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 grid-background opacity-20" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div 
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Leaf className="h-4 w-4" />
                <span>About Zero Graph</span>
              </motion.div>
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold font-display mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-foreground">India's Partner for</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-lime bg-clip-text text-transparent">
                  Credible Climate Action
                </span>
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                We provide the technology, expertise, and standards for Indian businesses to measure 
                their impact, reduce emissions, and achieve Net Zero goals with confidence.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 relative">
          <div className="absolute inset-0 dot-background opacity-20" />
          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <ScrollReveal animation="fadeRight">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-secondary mb-6">
                    <Target className="h-4 w-4" />
                    <span>OUR MISSION</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold font-display mb-6 text-foreground">
                    Making Climate Action <span className="text-primary">Accessible</span>
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Founded in 2020, Zero Graph was born from a simple observation: Indian businesses 
                      needed better tools to understand and reduce their carbon footprint. While global 
                      solutions existed, they often lacked the India-specific data, regulatory knowledge, 
                      and local support that companies here truly needed.
                    </p>
                    <p>
                      Today, we're proud to be India's leading carbon management platform, helping over 
                      500 companies across 15+ states take meaningful climate action. From BRSR compliance 
                      to carbon offset strategies, we provide end-to-end support for businesses of all sizes.
                    </p>
                    <p>
                      Our mission is clear: make credible climate action accessible to every Indian business, 
                      regardless of size or resources.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal animation="fadeLeft" delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="glass-strong text-center border-primary/10 hover:border-primary/30 transition-all">
                        <CardContent className="pt-6">
                          <p className="text-3xl lg:text-4xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                            {stat.value}
                          </p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container relative z-10">
            <ScrollReveal className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6">
                <Heart className="h-4 w-4" />
                <span>OUR VALUES</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4 text-foreground">
                Guided by <span className="text-secondary">Purpose</span>
              </h2>
              <p className="text-muted-foreground">
                Everything we do is guided by our commitment to making a real, measurable impact on the climate crisis.
              </p>
            </ScrollReveal>
            
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="glass-strong text-center border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all h-full">
                      <CardContent className="pt-6">
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 p-3 w-fit mx-auto mb-4">
                          <value.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground">{value.title}</h3>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 relative">
          <div className="absolute inset-0 dot-background opacity-20" />
          <div className="container relative z-10">
            <ScrollReveal className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-secondary mb-6">
                <Users className="h-4 w-4" />
                <span>OUR TEAM</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4 text-foreground">
                Leadership <span className="text-primary">Team</span>
              </h2>
              <p className="text-muted-foreground">
                A team of sustainability experts, technologists, and industry veterans committed to India's Net Zero future.
              </p>
            </ScrollReveal>
            
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="glass-strong border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all">
                      <CardContent className="pt-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                        <p className="text-sm text-primary mb-2">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
          <div className="container relative z-10">
            <ScrollReveal className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6">
                <Award className="h-4 w-4" />
                <span>CREDENTIALS</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4 text-foreground">
                Our <span className="text-secondary">Certifications</span>
              </h2>
              <p className="text-muted-foreground">
                Our expertise is backed by industry certifications and active partnerships in India's sustainability ecosystem.
              </p>
            </ScrollReveal>
            
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Award, label: "ISO 14001 Certified" },
                { icon: Shield, label: "ISO 9001 Certified" },
                { icon: Globe, label: "CDP Partner" },
                { icon: TrendingUp, label: "SBTi Aligned" },
              ].map((cert, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3 px-6 py-3 rounded-lg glass border-primary/10 hover:border-primary/30 transition-all"
                  whileHover={{ scale: 1.05, y: -3 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <cert.icon className="h-6 w-6 text-primary" />
                  <span className="font-medium text-foreground">{cert.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent" />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[200px]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="container relative z-10 text-center">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4 text-foreground">
                Ready to Start Your <span className="text-primary">Sustainability Journey</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join 500+ Indian companies already taking credible climate action with Zero Graph.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/consultation">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
                    Book a Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/calculators">
                  <Button size="lg" variant="outline" className="gap-2 border-primary/30 text-foreground hover:bg-primary/10 glass">
                    Try Our Calculators
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-primary/10 py-8 bg-card/50 backdrop-blur-sm">
          <div className="container text-center text-sm text-muted-foreground">
            © 2024 Zero Graph. All rights reserved.
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default About;