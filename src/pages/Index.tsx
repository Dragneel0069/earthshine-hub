import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Leaf,
  ArrowRight,
  CheckCircle2,
  TreePine,
  FileCheck,
  IndianRupee,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import heroImage from "@/assets/hero-india-solar.jpg";
import greenBuilding from "@/assets/green-building-india.jpg";
import sustainableFactory from "@/assets/sustainable-factory-india.jpg";

const valueProps = [
  {
    icon: FileCheck,
    title: "BRSR Compliance",
    description: "Meet SEBI's Business Responsibility and Sustainability Reporting requirements with automated data collection and audit-ready reports.",
    image: greenBuilding,
    imageAlt: "Green building in India with solar panels",
  },
  {
    icon: IndianRupee,
    title: "Cost Savings",
    description: "Identify energy inefficiencies and reduce operational costs by up to 30% through data-driven sustainability insights.",
    image: sustainableFactory,
    imageAlt: "Sustainable factory in India with wind turbines",
  },
  {
    icon: BadgeCheck,
    title: "Carbon Credits",
    description: "Generate and trade verified carbon credits through India's carbon market. Monetize your sustainability efforts.",
    image: heroImage,
    imageAlt: "Solar panel farm in India",
  },
];

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
              Track Your Carbon Footprint in{" "}
              <span className="text-primary">India</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl animate-slide-up text-balance" style={{ animationDelay: "0.1s" }}>
              Comprehensive carbon emissions tracking for Indian businesses. Achieve BRSR compliance, reduce costs, and access India's growing carbon credit market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto gap-2">
                <Calendar className="h-5 w-5" />
                Book Demo
              </Button>
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

      {/* Value Propositions Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold font-display mb-4">
              Why Indian Businesses Choose CarbonTrack
            </h2>
            <p className="text-muted-foreground text-lg">
              Built specifically for India's regulatory landscape and sustainability goals.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {valueProps.map((prop, index) => (
              <Card
                key={index}
                className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-transparent bg-card"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={prop.image} 
                    alt={prop.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <prop.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{prop.title}</h3>
                  <p className="text-muted-foreground">{prop.description}</p>
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
              Ready to achieve net-zero in India?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join 500+ Indian companies already tracking and reducing their emissions with CarbonTrack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="xl"
                  className="w-full sm:w-auto gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Calendar className="h-5 w-5" />
                Book Demo
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                BRSR Compliant
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Made for India
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
              © 2024 CarbonTrack India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
