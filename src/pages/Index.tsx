import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Leaf,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  TreePine,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track your carbon footprint with detailed dashboards and visualizations.",
  },
  {
    icon: Shield,
    title: "Compliance Ready",
    description: "Meet regulatory requirements with comprehensive emissions reporting.",
  },
  {
    icon: Zap,
    title: "Automated Tracking",
    description: "Connect your systems for automatic emissions data collection.",
  },
  {
    icon: Globe,
    title: "Carbon Marketplace",
    description: "Buy verified carbon credits directly through our platform.",
  },
];

const stats = [
  { value: "50K+", label: "Tons CO₂ Tracked" },
  { value: "2,500+", label: "Organizations" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "35%", label: "Avg. Reduction" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6 animate-fade-in">
              <Leaf className="h-4 w-4" />
              <span>Sustainability made simple</span>
            </div>
            <h1 className="text-4xl font-bold font-display tracking-tight sm:text-5xl lg:text-6xl mb-6 animate-slide-up text-balance">
              Track, Reduce, and{" "}
              <span className="text-primary">Offset</span> Your Carbon Footprint
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up text-balance" style={{ animationDelay: "0.1s" }}>
              Comprehensive carbon emissions tracking platform for businesses committed to sustainability. Make data-driven decisions to reduce your environmental impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="border-b bg-card">
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

      {/* Features Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold font-display mb-4">
              Everything you need to manage emissions
            </h2>
            <p className="text-muted-foreground text-lg">
              From data collection to carbon offsetting, we provide the tools to make your sustainability journey seamless.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-transparent bg-gradient-to-b from-card to-accent/30"
              >
                <CardContent className="p-6">
                  <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-primary-foreground/10 p-4 mb-6">
              <TreePine className="h-10 w-10" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
              Ready to reduce your carbon footprint?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of organizations already tracking and reducing their emissions with CarbonTrack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="xl"
                  className="w-full sm:w-auto gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">CarbonTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CarbonTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
