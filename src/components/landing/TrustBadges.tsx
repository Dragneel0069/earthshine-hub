import { Shield, Award, BadgeCheck, Building2 } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "ISO 14001",
    subtitle: "Certified",
  },
  {
    icon: Award,
    title: "ISO 9001",
    subtitle: "Quality Management",
  },
  {
    icon: BadgeCheck,
    title: "SEBI BRSR",
    subtitle: "Compliant",
  },
  {
    icon: Building2,
    title: "CII Member",
    subtitle: "Industry Partner",
  },
];

const partners = [
  "Bureau of Energy Efficiency",
  "TERI",
  "Indian Green Building Council",
  "CDP India",
  "GRI South Asia",
];

export function TrustBadges() {
  return (
    <section className="py-16 border-y bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Our Commitment to Quality & Standards
          </h3>
          <p className="text-sm text-muted-foreground">
            Backed by the highest industry standards and active partnerships in India's sustainability ecosystem
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-8">
          <p className="text-center text-xs text-muted-foreground mb-4">
            Trusted Partners & Affiliations
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {partners.map((partner, index) => (
              <span
                key={index}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
