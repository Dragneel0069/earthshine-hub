import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShoppingCart, Users, CheckCircle2, ArrowRight } from "lucide-react";

export function OffsetSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            Ready to Offset Your Carbon Footprint?
          </h2>
          <p className="text-muted-foreground text-lg">
            Already calculated your footprint? Take action now with verified Indian carbon offset projects.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
            <CardHeader>
              <div className="rounded-xl bg-primary p-3 w-fit mb-4">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">For Direct Action</CardTitle>
              <p className="text-lg font-medium text-primary">Carbon Offset Marketplace</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our marketplace makes it easy to take credible climate action in minutes. Perfect for businesses who want transparency and control.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Browse Verified Projects:</strong> Choose from VERRA, Gold Standard, and Indian Registry certified projects
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Instant Certificate:</strong> Receive your proof of impact immediately following payment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Support Indian Projects:</strong> Offset with renewable energy, afforestation, and clean cookstove projects across India
                  </span>
                </li>
              </ul>
              <Link to="/marketplace">
                <Button className="w-full gap-2 mt-4">
                  Visit the Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-secondary/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full" />
            <CardHeader>
              <div className="rounded-xl bg-secondary p-3 w-fit mb-4">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">For Corporate Portfolios</CardTitle>
              <p className="text-lg font-medium text-secondary">Expert Advisory Service</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Work directly with our sustainability consultants to build a high-impact, bespoke offsetting portfolio tailored to your strategic goals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Build a Defensible Portfolio:</strong> Expert analysis to build a portfolio that stands up to stakeholder scrutiny
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>BRSR & ESG Aligned:</strong> Ensure your offsets meet Indian regulatory and ESG disclosure requirements
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Maximize Impact:</strong> Strategic advice to navigate India's carbon market and optimize your investment
                  </span>
                </li>
              </ul>
              <Link to="/consultation">
                <Button variant="secondary" className="w-full gap-2 mt-4">
                  Contact Our Experts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
