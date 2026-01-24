import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Building2, Rocket, HelpCircle, Calculator, Users, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SEO } from "@/components/shared/SEO";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Starter",
    description: "For small teams getting started with carbon tracking",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    icon: Sparkles,
    popular: false,
    employees: "1-50 employees",
    cta: "Start Free Trial",
    ctaLink: "/signup",
    features: [
      { name: "Up to 5 team members", included: true },
      { name: "Scope 1 & 2 emissions tracking", included: true },
      { name: "Basic dashboard & charts", included: true },
      { name: "Monthly emissions reports", included: true },
      { name: "Email support", included: true },
      { name: "CEA India emission factors", included: true },
      { name: "BRSR report generation", included: false },
      { name: "Scope 3 supply chain", included: false },
      { name: "Accounting integrations", included: false },
      { name: "API access", included: false },
    ],
  },
  {
    name: "Professional",
    description: "For growing businesses with compliance requirements",
    monthlyPrice: 7499,
    yearlyPrice: 5999,
    icon: Rocket,
    popular: true,
    employees: "51-500 employees",
    cta: "Start Free Trial",
    ctaLink: "/signup",
    features: [
      { name: "Up to 25 team members", included: true },
      { name: "Scope 1, 2 & 3 tracking", included: true },
      { name: "BRSR report generation", included: true },
      { name: "Carbon credit marketplace", included: true },
      { name: "Vendor emission surveys", included: true },
      { name: "Tally & Zoho integration", included: true },
      { name: "AI-powered insights", included: true },
      { name: "Priority email support (24h)", included: true },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex sustainability needs",
    monthlyPrice: null,
    yearlyPrice: null,
    icon: Building2,
    popular: false,
    employees: "500+ employees",
    cta: "Contact Sales",
    ctaLink: "/consultation",
    features: [
      { name: "Unlimited team members", included: true },
      { name: "Advanced BRSR + CDP + GRI", included: true },
      { name: "Multi-location tracking", included: true },
      { name: "SAP & Oracle integration", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom API integrations", included: true },
      { name: "White-label options", included: true },
      { name: "SLA guarantees (99.9%)", included: true },
      { name: "On-premise deployment", included: true },
      { name: "24/7 priority support", included: true },
    ],
  },
];

const comparisonFeatures = [
  { name: "Team Members", starter: "5", professional: "25", enterprise: "Unlimited" },
  { name: "Emission Scopes", starter: "1 & 2", professional: "1, 2 & 3", enterprise: "1, 2 & 3" },
  { name: "Reporting Frameworks", starter: "Basic", professional: "BRSR", enterprise: "BRSR, CDP, GRI, TCFD" },
  { name: "Data Retention", starter: "2 years", professional: "5 years", enterprise: "Unlimited" },
  { name: "Accounting Integration", starter: "—", professional: "Tally, Zoho", enterprise: "SAP, Oracle, All" },
  { name: "Vendor Surveys", starter: "—", professional: "✓", enterprise: "✓" },
  { name: "Support", starter: "Email", professional: "Priority (24h)", enterprise: "24/7 Dedicated" },
  { name: "API Access", starter: "—", professional: "—", enterprise: "✓" },
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can explore all features before committing.",
  },
  {
    question: "Can I switch plans at any time?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and bank transfers. Enterprise customers can also pay via invoice with NET-30 terms.",
  },
  {
    question: "Do you offer discounts for NGOs or startups?",
    answer: "Yes! We offer 50% off for registered non-profits and special startup pricing for DIPP-registered startups. Contact us to learn more.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "Your data remains accessible for 30 days after cancellation. You can export all your data during this period. After that, it's securely deleted per GDPR requirements.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use enterprise-grade encryption (AES-256), are SOC 2 compliant, and host all data in India-based data centers. Your data is never shared with third parties.",
  },
];

const trustedBy = [
  "500+ Companies", "₹50Cr+ Savings Enabled", "1M+ Tonnes Tracked", "100% BRSR Compliant"
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const formatPrice = (monthly: number | null, yearly: number | null) => {
    if (monthly === null) return "Custom";
    const price = isYearly ? yearly : monthly;
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Pricing - Simple, Transparent Plans"
        url="/pricing"
        description="Choose the right Zero Graph plan for your business. Transparent pricing in INR with plans starting at ₹2,499/month. Free trial available."
        keywords="Zero Graph pricing, carbon tracking plans, BRSR reporting cost, carbon offset pricing India, sustainability software pricing"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              💰 Save 20% with annual billing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Simple, Transparent{" "}
              <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              No hidden fees. No surprises. Start free, scale as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch 
                checked={isYearly} 
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Save 20%
                </Badge>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {trustedBy.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 container">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`relative h-full flex flex-col ${
                  plan.popular 
                    ? "border-primary shadow-glow scale-[1.02] z-10" 
                    : "border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 rounded-xl bg-primary/10 p-3 w-fit">
                    <plan.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <Badge variant="outline" className="mx-auto mt-2">
                    <Users className="h-3 w-3 mr-1" />
                    {plan.employees}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {formatPrice(plan.monthlyPrice, plan.yearlyPrice)}
                      </span>
                      {plan.monthlyPrice !== null && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    {plan.monthlyPrice !== null && isYearly && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed annually (₹{((plan.yearlyPrice || 0) * 12).toLocaleString('en-IN')}/year)
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to={plan.ctaLink} className="w-full">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Calculator CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">Not sure which plan fits your needs?</p>
          <Link to="/calculators">
            <Button variant="outline" size="lg">
              <Calculator className="h-4 w-4 mr-2" />
              Try Our Free Calculator
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold mb-4">
              Compare Plans
            </h2>
            <p className="text-muted-foreground">
              See what's included at each level
            </p>
          </motion.div>
          
          <motion.div 
            className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-border/50 bg-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium text-foreground">Feature</th>
                    <th className="text-center p-4 font-medium text-foreground">
                      <div>Starter</div>
                      <div className="text-xs font-normal text-muted-foreground">₹2,499/mo</div>
                    </th>
                    <th className="text-center p-4 font-medium text-primary bg-primary/5">
                      <div>Professional</div>
                      <div className="text-xs font-normal text-muted-foreground">₹7,499/mo</div>
                    </th>
                    <th className="text-center p-4 font-medium text-foreground">
                      <div>Enterprise</div>
                      <div className="text-xs font-normal text-muted-foreground">Custom</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr 
                      key={feature.name} 
                      className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}
                    >
                      <td className="p-4 text-foreground font-medium">{feature.name}</td>
                      <td className="p-4 text-center text-muted-foreground">{feature.starter}</td>
                      <td className="p-4 text-center text-foreground font-medium bg-primary/5">{feature.professional}</td>
                      <td className="p-4 text-center text-muted-foreground">{feature.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Have questions? We've got answers.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Start Your Sustainability Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join 500+ Indian businesses already tracking and reducing their carbon footprint with Zero Graph.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow min-w-[200px]">
                  Start Free 14-Day Trial
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/consultation">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Talk to Sales
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
