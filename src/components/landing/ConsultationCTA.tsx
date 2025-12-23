import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

export function ConsultationCTA() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold font-display mb-2">
              Ready to Build Your Climate Strategy?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl">
              Whether you're taking your first step or building a comprehensive Net Zero plan, our team is ready to help. Let's discuss how our platforms can deliver your climate goals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/consultation">
              <Button
                size="lg"
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Book Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Phone className="h-4 w-4" />
              +91 1800-XXX-XXXX
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
