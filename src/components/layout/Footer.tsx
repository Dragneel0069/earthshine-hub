import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const platformLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Calculators", href: "/calculators" },
  { label: "Reports", href: "/reports" },
  { label: "Marketplace", href: "/marketplace" },
];

const resourceLinks = [
  { label: "Methodology", href: "/methodology" },
  { label: "Blog", href: "/blog" },
  { label: "Compliance Hub", href: "/compliance" },
  { label: "Knowledge Agent", href: "/knowledge" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/consultation" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/privacy#cookies" },
  { label: "Methodology", href: "/methodology" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-16 bg-card/30" role="contentinfo">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand Column */}
          <ScrollReveal delay={0} className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">Zero Graph</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              India's leading carbon intelligence platform for enterprises committed to Net Zero. 
              Track, reduce, and offset your carbon footprint with verified data.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com/ZeroGraph" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors" 
                aria-label="Follow us on Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/zerograph" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors" 
                aria-label="Connect with us on LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </ScrollReveal>

          {/* Platform Links */}
          <ScrollReveal delay={0.1}>
            <h4 className="font-semibold mb-4">Platform</h4>
            <nav aria-label="Platform navigation">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollReveal>

          {/* Resources Links */}
          <ScrollReveal delay={0.2}>
            <h4 className="font-semibold mb-4">Resources</h4>
            <nav aria-label="Resources navigation">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollReveal>

          {/* Company Links */}
          <ScrollReveal delay={0.3}>
            <h4 className="font-semibold mb-4">Company</h4>
            <nav aria-label="Company navigation">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href="mailto:info@zerograph.in" className="hover:text-foreground transition-colors">
                    info@zerograph.in
                  </a>
                </li>
              </ul>
            </nav>
          </ScrollReveal>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Zero Graph. All rights reserved.
          </p>
          <nav aria-label="Legal navigation">
            <ul className="flex gap-6 text-sm text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
