import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Globe2, TrendingUp, Target, Leaf, FileText, Play } from "lucide-react";

import { SocialProofStats } from "@/components/landing/SocialProofStats";
import { KnowledgeAgentSection } from "@/components/landing/KnowledgeAgentSection";
import { IndiaHeroSection } from "@/components/landing/IndiaHeroSection";
import { QuickCalculatorWidget } from "@/components/landing/QuickCalculatorWidget";
import { MethodologySection } from "@/components/landing/MethodologySection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SEO } from "@/components/shared/SEO";
import greenBuildingImg from "@/assets/green-building-india.jpg";
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

const Index = () => {
  return (
    <>
      <SEO 
        url="/"
        title="India's #1 Carbon Accounting & BRSR Compliance Platform"
        description="Zero Graph is India's leading carbon accounting platform. Track Scope 1, 2, 3 emissions, automate BRSR compliance, buy verified carbon credits, and plan your net zero journey. Trusted by 500+ Indian companies."
        keywords="zerograph, zero graph, carbon accounting India, carbon footprint calculator India, BRSR compliance software, carbon credits India, emissions tracking, GHG protocol India, net zero India, ESG reporting, Scope 1 2 3, carbon management, sustainability platform, SEBI BRSR, carbon credit marketplace"
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        <main id="main-content">
          {/* India-Focused Hero */}
          <IndiaHeroSection />

          {/* Hero CTA Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container px-4 md:px-6">
              <div className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 max-w-2xl mx-auto border shadow-lg text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-primary mb-4 md:mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>India's Premier Carbon Platform</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold font-display mb-3 md:mb-4 text-foreground">
                  Transform Complex Emissions Data Into 
                  <span className="text-primary block mt-1">Actionable Insights</span>
                </h2>
                
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                  AI-powered tracking, real-time analytics, and seamless BRSR compliance for enterprises committed to sustainability.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base">
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
            </div>
          </section>

          {/* Carbon Intelligence Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden h-[300px] md:h-[450px]">
                  <img
                    src={greenBuildingImg}
                    alt="Sustainable green building in India"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 border border-secondary/30 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-secondary">
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
                      <li key={i} className="flex items-center gap-2 md:gap-3">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm md:text-base text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Knowledge Agent Section */}
          <KnowledgeAgentSection />

          {/* Quick Calculator Widget */}
          <QuickCalculatorWidget />

          {/* How It Works Section */}
          <HowItWorksSection />

          {/* Platform Features */}
          <section className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-primary mb-4 md:mb-6">
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
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-card border rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                      <feature.icon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                    </div>
                    <h3 className="text-sm md:text-lg font-bold font-display mb-1 md:mb-2">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Methodology */}
          <MethodologySection />

          {/* Stats Section */}
          <section className="py-12 md:py-20 bg-muted/30">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card border rounded-xl md:rounded-2xl p-4 md:p-6"
                  >
                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-primary mb-2 md:mb-4" />
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-foreground mb-0.5 md:mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <SocialProofStats />

          {/* CTA */}
          <section className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="max-w-2xl mx-auto bg-card border rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-center">
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
                    <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-base">
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
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
