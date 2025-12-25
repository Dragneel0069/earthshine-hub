import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Leaf className="h-4 w-4" />
              <span>About Zero Graph</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-display mb-6">
              India's Partner for Credible Climate Action
            </h1>
            <p className="text-lg text-muted-foreground">
              We provide the technology, expertise, and standards for Indian businesses to measure 
              their impact, reduce emissions, and achieve Net Zero goals with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold font-display mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2020, Zero Graph was born from a simple observation: Indian businesses 
                needed better tools to understand and reduce their carbon footprint. While global 
                solutions existed, they often lacked the India-specific data, regulatory knowledge, 
                and local support that companies here truly needed.
              </p>
              <p className="text-muted-foreground mb-4">
                Today, we're proud to be India's leading carbon management platform, helping over 
                500 companies across 15+ states take meaningful climate action. From BRSR compliance 
                to carbon offset strategies, we provide end-to-end support for businesses of all sizes.
              </p>
              <p className="text-muted-foreground">
                Our mission is clear: make credible climate action accessible to every Indian business, 
                regardless of size or resources.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold font-display text-primary mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Our Values</h2>
            <p className="text-muted-foreground">
              Everything we do is guided by our commitment to making a real, measurable impact on the climate crisis.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="rounded-xl bg-primary/10 p-3 w-fit mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Our Leadership Team</h2>
            <p className="text-muted-foreground">
              A team of sustainability experts, technologists, and industry veterans committed to India's Net Zero future.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Our Credentials</h2>
            <p className="text-muted-foreground">
              Our expertise is backed by industry certifications and active partnerships in India's sustainability ecosystem.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Award, label: "ISO 14001 Certified" },
              { icon: Shield, label: "ISO 9001 Certified" },
              { icon: Globe, label: "CDP Partner" },
              { icon: TrendingUp, label: "SBTi Aligned" },
            ].map((cert, index) => (
              <div key={index} className="flex items-center gap-3 px-6 py-3 rounded-lg bg-card border">
                <cert.icon className="h-6 w-6 text-primary" />
                <span className="font-medium">{cert.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold font-display mb-4">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join 500+ Indian companies already taking credible climate action with Zero Graph.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button
                size="lg"
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/calculators">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Try Our Calculators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 Zero Graph. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default About;
