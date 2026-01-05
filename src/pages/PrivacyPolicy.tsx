import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Database, Cookie, Globe, UserCheck, Mail, Clock, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "introduction",
    icon: Shield,
    title: "Introduction",
    content: `Zero Graph ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our carbon tracking and sustainability platform.

We comply with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, the General Data Protection Regulation (GDPR), and other applicable data protection laws.

By accessing or using our services, you agree to this Privacy Policy. If you do not agree with our policies, please do not use our platform.`,
  },
  {
    id: "data-collection",
    icon: Database,
    title: "Information We Collect",
    content: `We collect information in several ways:

**Personal Information You Provide:**
• Account registration details (name, email, phone number)
• Company information (company name, GST number, industry type, location)
• Payment and billing information
• Communications with our support team

**Emissions & Sustainability Data:**
• Carbon emissions data across Scope 1, 2, and 3
• Energy consumption records
• Transportation and logistics data
• Supply chain emissions information

**Automatically Collected Information:**
• Device information (browser type, operating system)
• IP address and approximate location
• Usage data (pages visited, features used, time spent)
• Cookies and similar tracking technologies

**Third-Party Sources:**
• Verification data from carbon credit registries
• Public company information for B2B services`,
  },
  {
    id: "data-use",
    icon: UserCheck,
    title: "How We Use Your Information",
    content: `We use collected information for the following purposes:

**Service Delivery:**
• Providing carbon tracking and reporting services
• Generating BRSR, CSRD, CDP, and other compliance reports
• Facilitating carbon credit purchases and offsets
• Processing transactions and billing

**Platform Improvement:**
• Analyzing usage patterns to improve user experience
• Developing new features and services
• Conducting research on sustainability trends

**Communications:**
• Sending account notifications and updates
• Providing customer support
• Marketing communications (with your consent)
• Regulatory and compliance notifications

**Legal & Security:**
• Complying with legal obligations
• Preventing fraud and unauthorized access
• Enforcing our terms of service`,
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies & Tracking Technologies",
    content: `We use cookies and similar technologies to enhance your experience:

**Essential Cookies:**
Required for basic platform functionality, authentication, and security. These cannot be disabled.

**Analytics Cookies:**
Help us understand how visitors interact with our platform. We use this data to improve our services.

**Preference Cookies:**
Remember your settings and preferences for a personalized experience.

**Marketing Cookies:**
Used to deliver relevant advertisements and measure campaign effectiveness. These are only used with your explicit consent.

**Managing Cookies:**
You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.

Most browsers allow you to:
• View cookies stored on your device
• Delete individual or all cookies
• Block third-party cookies
• Block all cookies from specific sites`,
  },
  {
    id: "data-sharing",
    icon: Globe,
    title: "Information Sharing & Disclosure",
    content: `We may share your information in the following circumstances:

**Service Providers:**
We work with trusted third-party providers for:
• Cloud hosting and data storage
• Payment processing
• Email and communication services
• Analytics and monitoring

All service providers are contractually bound to protect your data.

**Carbon Credit Registries:**
When you purchase carbon credits, we share necessary information with verification bodies like Verra, Gold Standard, and other registries.

**Regulatory Authorities:**
We may disclose information to comply with:
• Legal obligations and court orders
• Government or regulatory requests
• Environmental reporting requirements

**Business Transfers:**
In the event of a merger, acquisition, or sale, your information may be transferred as part of business assets.

**With Your Consent:**
We may share information for other purposes with your explicit consent.`,
  },
  {
    id: "gdpr",
    icon: Lock,
    title: "GDPR & Your Rights",
    content: `If you are located in the European Economic Area (EEA), you have specific rights under the GDPR:

**Right to Access:**
Request a copy of the personal data we hold about you.

**Right to Rectification:**
Request correction of inaccurate or incomplete data.

**Right to Erasure:**
Request deletion of your personal data under certain circumstances.

**Right to Restriction:**
Request limitation of how we process your data.

**Right to Data Portability:**
Receive your data in a structured, machine-readable format.

**Right to Object:**
Object to processing based on legitimate interests or for marketing purposes.

**Right to Withdraw Consent:**
Withdraw consent at any time where processing is based on consent.

**Right to Lodge a Complaint:**
File a complaint with a supervisory authority if you believe your rights have been violated.

To exercise any of these rights, contact us at privacy@zerograph.in.`,
  },
  {
    id: "data-retention",
    icon: Clock,
    title: "Data Retention",
    content: `We retain your information for as long as necessary to:

**Active Accounts:**
• Account data: Retained while your account is active
• Emissions data: Retained for the duration of your subscription plus 7 years for compliance
• Transaction records: Retained for 7 years as required by law

**After Account Deletion:**
• Personal data: Deleted within 30 days of account closure
• Anonymized analytics: May be retained indefinitely
• Legal records: Retained as required by applicable laws

**Backup Systems:**
Data in backup systems is deleted within 90 days of primary deletion.

You may request earlier deletion of your data, subject to legal retention requirements.`,
  },
  {
    id: "security",
    icon: Shield,
    title: "Data Security",
    content: `We implement robust security measures to protect your information:

**Technical Safeguards:**
• End-to-end encryption for data transmission (TLS 1.3)
• Encryption at rest for stored data (AES-256)
• Regular security audits and penetration testing
• Multi-factor authentication options

**Organizational Measures:**
• Access controls and role-based permissions
• Employee security training
• Incident response procedures
• Regular security reviews

**Infrastructure Security:**
• SOC 2 Type II compliant hosting
• Geographic data redundancy
• 24/7 monitoring and threat detection
• Regular vulnerability assessments

While we strive to protect your data, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and protect your login credentials.`,
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    content: `If you have questions about this Privacy Policy or our data practices, please contact us:

**Data Protection Officer:**
Email: privacy@zerograph.in

**General Inquiries:**
Email: info@zerograph.in
Phone: +91 1800-XXX-XXXX

**Mailing Address:**
Zero Graph Private Limited
[Address Line 1]
[City, State, PIN Code]
India

**Response Time:**
We aim to respond to all privacy-related inquiries within 48 hours and resolve requests within 30 days as required by applicable laws.`,
  },
];

export default function PrivacyPolicy() {
  const lastUpdated = "January 1, 2026";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your data.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="max-w-3xl mx-auto border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground mb-4">Table of Contents</h2>
              <nav className="grid sm:grid-cols-2 gap-2">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    <span className="text-primary">{index + 1}.</span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Policy Sections */}
      <section className="py-8 container">
        <div className="max-w-3xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-foreground pt-1">
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <div key={pIndex} className="mb-4 last:mb-0">
                        {paragraph.startsWith('**') ? (
                          <div>
                            {paragraph.split('\n').map((line, lIndex) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return (
                                  <h3 key={lIndex} className="font-semibold text-foreground mt-4 mb-2 first:mt-0">
                                    {line.replace(/\*\*/g, '')}
                                  </h3>
                                );
                              } else if (line.startsWith('**')) {
                                const parts = line.split('**');
                                return (
                                  <h3 key={lIndex} className="font-semibold text-foreground mt-4 mb-2 first:mt-0">
                                    {parts[1]}
                                  </h3>
                                );
                              } else if (line.startsWith('•')) {
                                return (
                                  <p key={lIndex} className="text-muted-foreground pl-4 py-0.5">
                                    {line}
                                  </p>
                                );
                              }
                              return (
                                <p key={lIndex} className="text-muted-foreground">
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-line">
                            {paragraph}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 container">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Have questions about our privacy practices?
          </p>
          <Link 
            to="/consultation" 
            className="text-primary hover:underline font-medium"
          >
            Contact our Data Protection Officer →
          </Link>
        </motion.div>
      </section>

      <div className="h-20" />
    </div>
  );
}
