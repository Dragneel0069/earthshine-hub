import { Navbar } from "@/components/layout/Navbar";
import { SEO } from "@/components/shared/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Database, 
  Shield, 
  FileCheck, 
  Globe2, 
  Leaf,
  Calculator,
  Building2,
  Truck,
  Factory,
  Droplets,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const dataSources = [
  {
    name: "CEA CO2 Baseline Database",
    description: "Central Electricity Authority's official emission factors for India's power grid across all five regional grids.",
    category: "Electricity",
    year: "2023",
    icon: Building2,
    link: "https://cea.nic.in/",
  },
  {
    name: "IPCC Guidelines",
    description: "Intergovernmental Panel on Climate Change 2006 Guidelines for National Greenhouse Gas Inventories.",
    category: "Fuels & Process",
    year: "2006/2019",
    icon: Factory,
    link: "https://www.ipcc.ch/",
  },
  {
    name: "DEFRA Emission Factors",
    description: "UK Department for Environment, Food & Rural Affairs conversion factors, adapted for Indian context.",
    category: "Transport",
    year: "2023",
    icon: Truck,
    link: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting",
  },
  {
    name: "Indian Railways",
    description: "Official emission data from Indian Railways for rail transport calculations.",
    category: "Transport",
    year: "2023",
    icon: Truck,
    link: "https://indianrailways.gov.in/",
  },
  {
    name: "CPCB Guidelines",
    description: "Central Pollution Control Board waste management and disposal emission factors.",
    category: "Waste",
    year: "2023",
    icon: Trash2,
    link: "https://cpcb.nic.in/",
  },
  {
    name: "BIS Standards",
    description: "Bureau of Indian Standards for water consumption and treatment emission factors.",
    category: "Water",
    year: "2023",
    icon: Droplets,
    link: "https://www.bis.gov.in/",
  },
];

const methodologySteps = [
  {
    step: 1,
    title: "Data Collection",
    description: "We collect activity data from your operations including energy bills, fuel consumption, travel records, and supply chain invoices.",
    details: [
      "Automated data extraction from utility bills",
      "API integrations with ERP systems",
      "Manual data entry with validation checks",
      "Historical data import for baseline analysis",
    ],
  },
  {
    step: 2,
    title: "Scope Classification",
    description: "Emissions are categorized according to the GHG Protocol Corporate Standard into Scope 1, 2, and 3.",
    details: [
      "Scope 1: Direct emissions from owned sources",
      "Scope 2: Indirect emissions from purchased energy",
      "Scope 3: Value chain emissions (15 categories)",
      "Operational vs organizational boundaries",
    ],
  },
  {
    step: 3,
    title: "Emission Factor Application",
    description: "India-specific emission factors are applied to activity data to calculate CO2 equivalent emissions.",
    details: [
      "Region-specific grid emission factors",
      "Fuel-type specific conversion factors",
      "Mode-of-transport specific factors",
      "Industry benchmark comparisons",
    ],
  },
  {
    step: 4,
    title: "Quality Assurance",
    description: "Multi-level validation ensures data accuracy and compliance with reporting standards.",
    details: [
      "Automated anomaly detection",
      "Year-over-year variance analysis",
      "Third-party verification support",
      "Audit trail maintenance",
    ],
  },
];

const standards = [
  {
    name: "GHG Protocol",
    description: "The most widely used international accounting tool for government and business leaders.",
    status: "Aligned",
  },
  {
    name: "ISO 14064",
    description: "International standard for quantification and reporting of GHG emissions and removals.",
    status: "Compliant",
  },
  {
    name: "SEBI BRSR",
    description: "Securities and Exchange Board of India's Business Responsibility and Sustainability Reporting framework.",
    status: "Compliant",
  },
  {
    name: "TCFD",
    description: "Task Force on Climate-related Financial Disclosures recommendations for climate risk reporting.",
    status: "Supported",
  },
  {
    name: "CDP",
    description: "Carbon Disclosure Project reporting framework for environmental transparency.",
    status: "Supported",
  },
  {
    name: "SBTi",
    description: "Science Based Targets initiative methodology for setting emissions reduction targets.",
    status: "Aligned",
  },
];

const Methodology = () => {
  return (
    <SEO 
        title="Methodology & Data Sources"
        url="/methodology"
        description="Learn about Zero Graph's carbon accounting methodology, emission factor sources, and compliance with international standards like GHG Protocol and ISO 14064."
        keywords="carbon accounting methodology, emission factors India, GHG Protocol, ISO 14064, BRSR compliance, carbon calculation, CEA emission factors"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main id="main-content" className="py-12 lg:py-20">
          <div className="container">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">
                <BookOpen className="h-3 w-3 mr-1" />
                Transparency & Trust
              </Badge>
              <h1 className="text-3xl lg:text-5xl font-bold font-display mb-4">
                Our <span className="text-primary">Methodology</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We believe in complete transparency. Here's exactly how we calculate emissions, 
                where our data comes from, and which standards we follow.
              </p>
            </div>

            {/* How We Calculate */}
            <section className="mb-20">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold font-display mb-8 text-center">
                  How We Calculate Emissions
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {methodologySteps.map((step, index) => (
                  <div>
                    <Card className="h-full hover-lift">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-bold">{step.step}</span>
                          </div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              <span className="text-muted-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Sources */}
            <section className="mb-20">
              <div>
                <div className="flex items-center gap-3 justify-center mb-8">
                  <Database className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl lg:text-3xl font-bold font-display">
                    Emission Factor Sources
                  </h2>
                </div>
                <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                  We use only authoritative, peer-reviewed, and government-published emission factors. 
                  Our factors are updated annually to reflect the latest data.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataSources.map((source, index) => (
                  <div>
                    <Card className="h-full hover-lift group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <source.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{source.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{source.category}</Badge>
                                <span className="text-xs text-muted-foreground">{source.year}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{source.description}</p>
                        <a 
                          href={source.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          View Source <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* Standards & Compliance */}
            <section className="mb-20">
              <div>
                <div className="flex items-center gap-3 justify-center mb-8">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl lg:text-3xl font-bold font-display">
                    Standards & Compliance
                  </h2>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standards.map((standard, index) => (
                  <div>
                    <Card className="hover-lift">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{standard.name}</h3>
                          <Badge 
                            variant={standard.status === "Compliant" ? "default" : "secondary"}
                            className={standard.status === "Compliant" ? "bg-primary" : ""}
                          >
                            {standard.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{standard.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </section>

            {/* Calculation Example */}
            <section className="mb-20">
              <div>
                <Card className="bg-muted/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Calculator className="h-6 w-6 text-primary" />
                      <CardTitle>Example Calculation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-lg bg-background border">
                        <h4 className="font-medium mb-2">Activity Data</h4>
                        <p className="text-2xl font-bold text-primary">10,000 kWh</p>
                        <p className="text-sm text-muted-foreground">Monthly electricity consumption in Maharashtra</p>
                      </div>
                      <div className="p-4 rounded-lg bg-background border">
                        <h4 className="font-medium mb-2">Emission Factor</h4>
                        <p className="text-2xl font-bold text-primary">0.79 kg CO₂e/kWh</p>
                        <p className="text-sm text-muted-foreground">Western Grid Factor (CEA 2023)</p>
                      </div>
                      <div className="p-4 rounded-lg bg-background border">
                        <h4 className="font-medium mb-2">Result</h4>
                        <p className="text-2xl font-bold text-primary">7.9 tCO₂e</p>
                        <p className="text-sm text-muted-foreground">Scope 2 emissions for the month</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm">
                        <strong>Formula:</strong> Emissions (kg CO₂e) = Activity Data × Emission Factor
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        10,000 kWh × 0.79 kg CO₂e/kWh = 7,900 kg CO₂e = 7.9 tCO₂e
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* CTA */}
            <div>
              <div className="text-center">
                <Card className="inline-block p-8">
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <Leaf className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Ready to Calculate Your Emissions?</h2>
                  </div>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Use our calculators powered by this methodology to get accurate, 
                    India-specific emission estimates for your organization.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/calculators">
                      <Button className="gap-2">
                        <Calculator className="h-4 w-4" />
                        Try Our Calculators
                      </Button>
                    </Link>
                    <Link to="/consultation">
                      <Button variant="outline">Book a Consultation</Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Methodology;
