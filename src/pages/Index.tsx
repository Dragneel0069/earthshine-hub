import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Leaf,
  ArrowRight,
  CheckCircle2,
  TreePine,
  Calendar,
  Search,
} from "lucide-react";
import heroImage from "@/assets/hero-india-solar.jpg";
import { PathwaySection } from "@/components/landing/PathwaySection";
import { ProductCards } from "@/components/landing/ProductCards";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { OffsetSection } from "@/components/landing/OffsetSection";
import { ImpactProjects } from "@/components/landing/ImpactProjects";
import { ConsultationCTA } from "@/components/landing/ConsultationCTA";
import { Input } from "@/components/ui/input";

const stats = [
  { value: "500+", label: "Indian Companies" },
  { value: "₹50Cr+", label: "Cost Savings" },
  { value: "1M+", label: "Tons CO₂ Tracked" },
  { value: "100%", label: "BRSR Compliant" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Solar panels in India" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        
        <div className="container relative py-24 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
              <Leaf className="h-4 w-4" />
              <span>India's #1 Carbon Management Platform</span>
            </div>
            <h1 className="text-4xl font-bold font-display tracking-tight sm:text-5xl lg:text-6xl mb-6 animate-slide-up text-balance text-foreground">
              Your Partner for{" "}
              <span className="text-primary">Credible Climate Action</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl animate-slide-up text-balance" style={{ animationDelay: "0.1s" }}>
              We provide the technology, expertise, and standards for Indian businesses to measure their impact, reduce emissions, and achieve Net Zero goals with confidence.
            </p>
            
            {/* AI Search Bar */}
            <div className="relative max-w-lg mb-8 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border rounded-lg p-1.5 shadow-lg">
                <div className="flex items-center gap-2 px-3 text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Search with AI</span>
                </div>
                <Input 
                  placeholder="Ask anything about carbon tracking..." 
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/marketplace">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                  Buy Offsets
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/consultation">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto gap-2">
                  <Calendar className="h-5 w-5" />
                  Get a Consultation
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Setup in 5 minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold font-display text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathway Section */}
      <PathwaySection />

      {/* Product Cards */}
      <ProductCards />

      {/* Offset Section */}
      <OffsetSection />

      {/* Impact Projects */}
      <ImpactProjects />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Consultation CTA */}
      <ConsultationCTA />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
              <TreePine className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
              Ready to achieve Net Zero in India?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join 500+ Indian companies already tracking and reducing their emissions with Bharat Carbon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="xl" className="w-full sm:w-auto gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/calculators">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto gap-2"
                >
                  Try Our Calculators
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                BRSR Compliant
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Made for India
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-semibold">Bharat Carbon</span>
              </div>
              <p className="text-sm text-muted-foreground">
                India's leading carbon management platform for businesses committed to Net Zero.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/calculators" className="hover:text-foreground transition-colors">Carbon Calculators</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Tracking Platform</Link></li>
                <li><Link to="/reports" className="hover:text-foreground transition-colors">BRSR Reporting</Link></li>
                <li><Link to="/marketplace" className="hover:text-foreground transition-colors">Carbon Credits</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/consultation" className="hover:text-foreground transition-colors">Get Consultation</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@bharatcarbon.in</li>
                <li>+91 1800-XXX-XXXX</li>
                <li>Mumbai, Maharashtra, India</li>
              </ul>
            </div>
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
  );
};

export default Index;
