import { Shield, Award, BadgeCheck, Building2, ExternalLink } from "lucide-react";
const certifications = [
  {
    icon: Shield,
    title: "ISO 14064",
    subtitle: "GHG Verification",
    description: "International standard for greenhouse gas accounting",
  },
  {
    icon: Award,
    title: "GHG Protocol",
    subtitle: "Aligned",
    description: "Full compliance with corporate accounting standards",
  },
  {
    icon: BadgeCheck,
    title: "SEBI BRSR",
    subtitle: "Compliant",
    description: "Ready for mandatory Indian ESG disclosures",
  },
  {
    icon: Building2,
    title: "CDP Partner",
    subtitle: "Accredited",
    description: "Environmental disclosure integration",
  },
];

const partners = [
  { name: "Bureau of Energy Efficiency", type: "Data Partner" },
  { name: "TERI", type: "Research Partner" },
  { name: "Indian Green Building Council", type: "Industry Partner" },
  { name: "CDP India", type: "Disclosure Partner" },
  { name: "GRI South Asia", type: "Standards Partner" },
  { name: "CII Green Building Council", type: "Industry Partner" },
];

const clientLogos = [
  "Tata Group",
  "Mahindra",
  "Infosys",
  "Wipro",
  "L&T",
  "Reliance",
];

export function TrustBadges() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-card to-muted/50" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <div 
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold font-display mb-2">
            Trusted by Industry Leaders
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade platform backed by international standards and India's leading sustainability organizations.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {certifications.map((cert, index) => (
            <div
              key={cert.title}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <cert.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{cert.title}</span>
                    <span className="text-xs text-primary font-medium">{cert.subtitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos Ticker */}
        <div
          className="mb-12 py-6 border-y border-border"
        >
          <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-wider">
            Trusted by 500+ Indian Companies Including
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {clientLogos.map((logo, index) => (
              <span
                key={logo}
                className="text-lg font-display font-semibold text-muted-foreground/60 hover:text-foreground transition-colors cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        <div
        >
          <p className="text-center text-xs text-muted-foreground mb-6 uppercase tracking-wider">
            Strategic Partners & Affiliations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="group p-3 rounded-lg bg-muted/50 hover:bg-muted text-center transition-colors cursor-default"
              >
                <p className="text-xs font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                  {partner.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency CTA */}
        <div
          className="mt-12 text-center"
        >
          <a 
            href="/methodology" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            View our calculation methodology and data sources
          </a>
        </div>
      </div>
    </section>
  );
}
