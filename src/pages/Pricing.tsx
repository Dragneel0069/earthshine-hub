import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Building2, Rocket, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const plans = [
  {
    name: "Free",
    description: "Perfect for individuals exploring carbon tracking",
    price: "₹0",
    period: "forever",
    icon: Sparkles,
    popular: false,
    cta: "Get Started Free",
    ctaLink: "/signup",
    features: [
      { name: "Personal carbon calculator", included: true },
      { name: "Monthly emissions tracking", included: true },
      { name: "Basic dashboard", included: true },
      { name: "Up to 3 emission sources", included: true },
      { name: "Community support", included: true },
      { name: "BRSR reporting", included: false },
      { name: "Carbon credit marketplace", included: false },
      { name: "API access", included: false },
      { name: "Dedicated support", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For SMEs and growing businesses committed to sustainability",
    price: "₹4,999",
    period: "/month",
    icon: Rocket,
    popular: true,
    cta: "Start Free Trial",
    ctaLink: "/signup",
    features: [
      { name: "Everything in Free", included: true },
      { name: "Unlimited emission sources", included: true },
      { name: "Scope 1, 2 & 3 tracking", included: true },
      { name: "BRSR report generation", included: true },
      { name: "Carbon credit marketplace", included: true },
      { name: "AI-powered insights", included: true },
      { name: "Priority email support", included: true },
      { name: "Team collaboration (5 users)", included: true },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex sustainability needs",
    price: "Custom",
    period: "",
    icon: Building2,
    popular: false,
    cta: "Contact Sales",
    ctaLink: "/consultation",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Unlimited users", included: true },
      { name: "Advanced BRSR + CSRD + CDP", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom API integrations", included: true },
      { name: "White-label options", included: true },
      { name: "SLA guarantees", included: true },
      { name: "On-premise deployment", included: true },
      { name: "Custom training", included: true },
      { name: "24/7 priority support", included: true },
    ],
  },
];

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "Yes! Pro comes with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, UPI, net banking, and can also process invoices for Enterprise customers.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes, annual billing saves you 20% compared to monthly billing. Contact us for special pricing.",
  },
];

const comparisonFeatures = [
  { name: "Emission Sources", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Team Members", free: "1", pro: "5", enterprise: "Unlimited" },
  { name: "Reporting Frameworks", free: "None", pro: "BRSR", enterprise: "BRSR, CSRD, CDP, GRI" },
  { name: "Data Retention", free: "1 year", pro: "5 years", enterprise: "Unlimited" },
  { name: "Support", free: "Community", pro: "Email (24h)", enterprise: "24/7 Dedicated" },
  { name: "API Access", free: "—", pro: "—", enterprise: "✓" },
  { name: "Custom Integrations", free: "—", pro: "—", enterprise: "✓" },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
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
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Choose the Right Plan for Your{" "}
              <span className="text-primary">Sustainability Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              From individuals to enterprises, we have a plan that fits your carbon management needs. 
              Start free, scale as you grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 container">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    ? "border-primary shadow-glow scale-105 z-10" 
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
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
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
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 container">
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
            See what's included in each plan at a glance
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left p-4 font-medium text-foreground">Feature</th>
                  <th className="text-center p-4 font-medium text-foreground">Free</th>
                  <th className="text-center p-4 font-medium text-primary">Pro</th>
                  <th className="text-center p-4 font-medium text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr 
                    key={feature.name} 
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}
                  >
                    <td className="p-4 text-foreground">{feature.name}</td>
                    <td className="p-4 text-center text-muted-foreground">{feature.free}</td>
                    <td className="p-4 text-center text-foreground font-medium">{feature.pro}</td>
                    <td className="p-4 text-center text-muted-foreground">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-muted/20">
        <div className="container">
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
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of Indian businesses already tracking and reducing their carbon footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/consultation">
              <Button size="lg" variant="outline">
                Talk to an Expert
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer spacer */}
      <div className="h-20" />
    </div>
  );
}
