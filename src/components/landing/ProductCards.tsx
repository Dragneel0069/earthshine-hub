import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Award, 
  ShoppingCart, 
  Database, 
  Plane, 
  Star,
  ArrowRight
} from "lucide-react";

const products = [
  {
    icon: BarChart3,
    title: "Carbon Tracking Platform",
    subtitle: "Zero Graph Pro",
    description: "Comprehensive carbon management platform for Indian businesses to calculate, track, and report emissions across all scopes.",
    href: "/dashboard",
    featured: true,
  },
  {
    icon: Award,
    title: "BRSR Compliance",
    subtitle: "Net Zero Standard",
    description: "Achieve SEBI's BRSR compliance with automated reporting and verification for listed Indian companies.",
    href: "/reports",
    featured: true,
  },
  {
    icon: ShoppingCart,
    title: "Carbon Credit Marketplace",
    subtitle: "Offset India",
    description: "A transparent marketplace to purchase high-quality, verified carbon credits from Indian offset projects.",
    href: "/marketplace",
    featured: true,
  },
  {
    icon: Database,
    title: "Emissions Factor Database",
    subtitle: "India Grid Data",
    description: "Access state-wise grid emission factors and India-specific emission data for accurate calculations.",
    href: "/calculators",
    featured: false,
  },
  {
    icon: Plane,
    title: "Travel Carbon Calculator",
    subtitle: "Business Travel",
    description: "Calculate and offset business travel emissions with Indian airline and transport emission factors.",
    href: "/calculators",
    featured: false,
  },
  {
    icon: Star,
    title: "Project Ratings",
    subtitle: "CRISP India",
    description: "Independent quality ratings for Indian carbon offset projects to help you make informed decisions.",
    href: "/marketplace",
    featured: false,
  },
];

export function ProductCards() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            Your Partner for Climate Action in India
          </h2>
          <p className="text-muted-foreground text-lg">
            We provide the technology, expertise, and standards for Indian businesses to measure their impact, reduce emissions, and achieve Net Zero goals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Card
              key={index}
              className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                product.featured ? "border-primary/20 bg-gradient-to-b from-primary/5 to-transparent" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`rounded-xl p-3 ${product.featured ? "bg-primary" : "bg-muted"} transition-transform group-hover:scale-110`}>
                    <product.icon className={`h-6 w-6 ${product.featured ? "text-primary-foreground" : "text-foreground"}`} />
                  </div>
                  {product.featured && (
                    <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl text-primary">{product.title}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{product.subtitle}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6">{product.description}</p>
                <Link to={product.href}>
                  <Button 
                    variant={product.featured ? "default" : "outline"} 
                    className="w-full gap-2 group-hover:gap-3 transition-all"
                  >
                    Find Out More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
