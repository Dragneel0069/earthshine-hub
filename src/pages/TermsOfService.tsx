import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  CreditCard,
  Ban,
  RefreshCw,
  Globe,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/SEO";

const sections = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: `By accessing or using Zero Graph's services, website, or any associated applications (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services.

These Terms constitute a legally binding agreement between you and Zero Graph Private Limited ("Zero Graph," "we," "us," or "our"). We may update these Terms from time to time, and your continued use of the Services constitutes acceptance of any modifications.`
  },
  {
    id: "services",
    icon: Globe,
    title: "2. Description of Services",
    content: `Zero Graph provides carbon emissions tracking, reporting, and offset services for businesses operating in India. Our Services include:

• **Carbon Footprint Calculators**: Tools to measure Scope 1, 2, and 3 emissions
• **Emissions Dashboard**: Real-time analytics and visualization of carbon data
• **Carbon Credit Marketplace**: Access to verified Indian carbon offset projects
• **Compliance Reporting**: BRSR, CDP, and other regulatory report generation
• **Knowledge Resources**: Educational content and sustainability guidance

We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time without prior notice.`
  },
  {
    id: "accounts",
    icon: Users,
    title: "3. User Accounts",
    content: `**Account Registration**: To access certain features, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.

**Account Responsibilities**: You agree to:
• Provide accurate, current, and complete information
• Update your information to keep it accurate and complete
• Maintain the security of your password and account
• Notify us immediately of any unauthorized access
• Accept responsibility for all activities under your account

**Business Accounts**: If you register on behalf of an organization, you represent that you have authority to bind that organization to these Terms.`
  },
  {
    id: "acceptable-use",
    icon: ShieldCheck,
    title: "4. Acceptable Use Policy",
    content: `You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to:

• Use the Services for any illegal or unauthorized purpose
• Submit false, misleading, or fraudulent emissions data
• Attempt to gain unauthorized access to our systems
• Interfere with or disrupt the Services or servers
• Reverse engineer or attempt to extract source code
• Use automated systems to access the Services without permission
• Transmit viruses, malware, or other harmful code
• Impersonate any person or entity
• Violate any applicable laws or regulations

We reserve the right to investigate and take appropriate action against anyone who violates these provisions.`
  },
  {
    id: "data-accuracy",
    icon: AlertTriangle,
    title: "5. Data Accuracy & Responsibility",
    content: `**User Data Responsibility**: You are solely responsible for the accuracy, quality, and legality of the emissions data you submit. Zero Graph provides calculation tools based on standard emission factors, but does not verify the underlying activity data you provide.

**No Guarantee**: While we strive for accuracy, we do not guarantee that our calculations or emission factors are error-free. You should independently verify critical calculations, especially for regulatory compliance purposes.

**Third-Party Verification**: For official compliance reporting, we recommend engaging third-party verification services. Our reports are intended as tools to support, not replace, professional verification.`
  },
  {
    id: "intellectual-property",
    icon: Scale,
    title: "6. Intellectual Property",
    content: `**Our Intellectual Property**: All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Zero Graph and are protected by copyright, trademark, and other intellectual property laws.

**Your License to Use**: We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business purposes, subject to these Terms.

**Your Content**: You retain ownership of emissions data and content you submit. By submitting content, you grant us a non-exclusive license to use, store, and process that data to provide the Services.`
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "7. Payment Terms",
    content: `**Subscription Plans**: Certain features require a paid subscription. By subscribing, you agree to pay all applicable fees as described on our pricing page.

**Billing**: Subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law.

**Price Changes**: We may change our prices at any time. Price changes will take effect at the start of your next billing cycle.

**Taxes**: You are responsible for paying all applicable taxes. Prices displayed may not include GST or other taxes, which will be added at checkout.

**Failed Payments**: If payment fails, we may suspend your access to paid features until payment is received.`
  },
  {
    id: "carbon-credits",
    icon: RefreshCw,
    title: "8. Carbon Credits & Offsets",
    content: `**Marketplace Transactions**: When purchasing carbon credits through our marketplace, you are transacting directly with the project developers or authorized sellers. Zero Graph facilitates these transactions but is not the seller of record.

**Verification Standards**: We list only projects verified by recognized standards (VCS, Gold Standard, etc.). However, we do not guarantee project performance or the accuracy of project claims.

**No Investment Advice**: Carbon credits are not investment products. Purchase decisions should be based on your offsetting needs, not investment returns.

**Retirement**: Upon purchase, credits will be retired in your name in the applicable registry. Retirement is final and cannot be reversed.`
  },
  {
    id: "termination",
    icon: Ban,
    title: "9. Termination",
    content: `**By You**: You may terminate your account at any time by contacting us or using account settings. Upon termination, your right to use the Services will cease immediately.

**By Us**: We may terminate or suspend your account at any time, without prior notice or liability, for any reason, including if you breach these Terms.

**Effect of Termination**: Upon termination:
• Your access to the Services will be revoked
• Any data you submitted may be deleted after 30 days
• You remain liable for any outstanding fees
• Provisions that should survive termination will remain in effect`
  },
  {
    id: "disclaimers",
    icon: AlertTriangle,
    title: "10. Disclaimers & Limitation of Liability",
    content: `**As-Is Basis**: THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

**No Warranty**: We do not warrant that the Services will be uninterrupted, error-free, or completely secure. We disclaim all warranties including merchantability, fitness for a particular purpose, and non-infringement.

**Limitation of Liability**: TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZERO GRAPH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL.

**Maximum Liability**: Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.`
  },
  {
    id: "governing-law",
    icon: Scale,
    title: "11. Governing Law & Disputes",
    content: `**Governing Law**: These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.

**Jurisdiction**: Any disputes arising from these Terms or your use of the Services shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.

**Arbitration**: Before initiating any legal proceeding, you agree to attempt to resolve disputes through good-faith negotiation. If unsuccessful after 30 days, disputes may be submitted to binding arbitration under the Arbitration and Conciliation Act, 1996.`
  },
  {
    id: "contact",
    icon: Mail,
    title: "12. Contact Information",
    content: `If you have any questions about these Terms of Service, please contact us:

**Zero Graph Private Limited**
Email: legal@zerograph.in
Phone: +91-9500040005
Address: Chennai, Tamil Nadu, India

**For Support**: support@zerograph.in
**For Privacy Concerns**: privacy@zerograph.in

We aim to respond to all inquiries within 2 business days.`
  }
];

const TermsOfService = () => {
  return (
    <>
      <SEO title="Terms of Service" url="/terms" description="Read Zero Graph's terms of service. Understand your rights and responsibilities when using our carbon tracking platform." />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-muted to-background">
          <div className="container">
            <div
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-accent border border-border px-4 py-2 text-sm font-medium text-primary mb-6">
                <Scale className="h-4 w-4" />
                <span>Legal</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold font-display mb-4 text-foreground">
                Terms of Service
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                Please read these terms carefully before using Zero Graph's services.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: January 22, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-8 border-b border-border">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Navigation</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {section.title.split(". ")[1]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-8">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  id={section.id}
                >
                  <Card className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-accent p-3 flex-shrink-0">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-foreground mb-4">
                            {section.title}
                          </h2>
                          <div className="prose prose-sm max-w-none text-muted-foreground">
                            {section.content.split('\n\n').map((paragraph, i) => (
                              <p key={i} className="mb-3 whitespace-pre-line">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Related Documents</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/privacy">
                  <Button variant="outline" className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Privacy Policy
                  </Button>
                </Link>
                <Link to="/consultation">
                  <Button className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 bg-card">
          <div className="container text-center text-sm text-muted-foreground">
            © 2026 Zero Graph. All rights reserved.
          </div>
        </footer>
      </div>
  );
};

export default TermsOfService;
