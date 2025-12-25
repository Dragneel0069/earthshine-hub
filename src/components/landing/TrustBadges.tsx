import { Shield, Award, BadgeCheck, Building2 } from "lucide-react";

// Placeholder badges - replace with your actual certifications
const badges = [
  {
    icon: Shield,
    title: "Certification",
    subtitle: "Add your certification",
  },
  {
    icon: Award,
    title: "Certification",
    subtitle: "Add your certification",
  },
  {
    icon: BadgeCheck,
    title: "Compliance",
    subtitle: "Add your compliance",
  },
  {
    icon: Building2,
    title: "Partnership",
    subtitle: "Add your partnership",
  },
];

// Placeholder partners - replace with your actual partners
const partners = [
  "Partner 1",
  "Partner 2",
  "Partner 3",
  "Partner 4",
  "Partner 5",
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
            Backed by industry standards and partnerships in the sustainability ecosystem
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
