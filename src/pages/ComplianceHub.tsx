import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useEmissionsSummary } from "@/hooks/useEmissions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileText,
  Download,
  Globe,
  Building2,
  Shield,
  Target,
  Leaf,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";

const FRAMEWORKS = [
  {
    id: "brsr",
    name: "BRSR",
    fullName: "Business Responsibility and Sustainability Reporting",
    description: "SEBI-mandated ESG disclosure for top 1000 listed companies in India",
    region: "India",
    mandatory: true,
    icon: Building2,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    requirements: [
      "Scope 1 & 2 emissions (mandatory)",
      "Scope 3 emissions (voluntary)",
      "Energy consumption",
      "Water usage",
      "Waste management",
      "Social responsibility metrics",
    ],
  },
  {
    id: "csrd",
    name: "CSRD",
    fullName: "Corporate Sustainability Reporting Directive",
    description: "EU's comprehensive sustainability reporting standard",
    region: "Europe",
    mandatory: true,
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    requirements: [
      "Double materiality assessment",
      "All Scope emissions with third-party assurance",
      "Climate transition plans",
      "Biodiversity impact",
      "Social and governance metrics",
      "Digital tagging (XBRL)",
    ],
  },
  {
    id: "cdp",
    name: "CDP",
    fullName: "Carbon Disclosure Project",
    description: "Global environmental disclosure system for investors and supply chains",
    region: "Global",
    mandatory: false,
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-100",
    requirements: [
      "Governance on climate issues",
      "Risks and opportunities",
      "Business strategy and targets",
      "Scope 1, 2, and 3 emissions",
      "Emissions reduction initiatives",
      "Value chain engagement",
    ],
  },
  {
    id: "gri",
    name: "GRI",
    fullName: "Global Reporting Initiative",
    description: "World's most widely used sustainability reporting standards",
    region: "Global",
    mandatory: false,
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    requirements: [
      "Organizational profile",
      "Stakeholder engagement",
      "Material topics",
      "Management approach",
      "Topic-specific disclosures",
      "External assurance",
    ],
  },
  {
    id: "tcfd",
    name: "TCFD",
    fullName: "Task Force on Climate-related Financial Disclosures",
    description: "Climate risk disclosure framework for financial markets",
    region: "Global",
    mandatory: false,
    icon: Target,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    requirements: [
      "Board oversight",
      "Climate risk identification",
      "Scenario analysis",
      "Risk management integration",
      "Metrics and targets",
      "Strategy disclosure",
    ],
  },
  {
    id: "sec",
    name: "SEC Climate",
    fullName: "SEC Climate Disclosure Rules",
    description: "US securities climate-related disclosure requirements",
    region: "United States",
    mandatory: true,
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-100",
    requirements: [
      "Governance disclosures",
      "Climate risk assessment",
      "Scope 1 & 2 emissions",
      "Financial statement impacts",
      "Climate targets and goals",
      "Third-party attestation",
    ],
  },
];

export default function ComplianceHub() {
  const { user } = useAuth();
  const { summary, isLoading: emissionsLoading } = useEmissionsSummary();
  const [generating, setGenerating] = useState<string | null>(null);

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const generateReport = async (frameworkId: string) => {
    if (!user || !summary) {
      toast.error("Please sign in and ensure you have emissions data");
      return;
    }

    setGenerating(frameworkId);
    const framework = FRAMEWORKS.find((f) => f.id === frameworkId);
    
    try {
      const doc = new jsPDF();
      const now = new Date();
      const year = now.getFullYear();

      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(`${framework?.name} Compliance Report`, 20, 25);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(framework?.fullName || "", 20, 35);
      doc.text(`Report Period: FY ${year - 1}-${year}`, 20, 42);
      doc.text(`Generated: ${now.toLocaleDateString()}`, 20, 49);

      // Company Info
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Organization Details", 20, 65);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const companyInfo = [
        ["Company Name", userProfile?.company_name || "Not provided"],
        ["Industry", userProfile?.industry_type || "Not provided"],
        ["Location", `${userProfile?.city || "N/A"}, ${userProfile?.state || "N/A"}`],
        ["GST Number", userProfile?.gst_number || "Not provided"],
      ];
      
      autoTable(doc, {
        startY: 70,
        head: [],
        body: companyInfo,
        theme: "plain",
        styles: { fontSize: 10 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
      });

      // Emissions Summary
      const emissionsY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("GHG Emissions Summary", 20, emissionsY);

      const emissionsData = [
        ["Category", "Emissions (tCO₂e)", "% of Total"],
        ["Scope 1 (Direct)", summary.byScope.scope1.toFixed(2), `${((summary.byScope.scope1 / summary.totalEmissions) * 100).toFixed(1)}%`],
        ["Scope 2 (Energy)", summary.byScope.scope2.toFixed(2), `${((summary.byScope.scope2 / summary.totalEmissions) * 100).toFixed(1)}%`],
        ["Scope 3 (Value Chain)", summary.byScope.scope3.toFixed(2), `${((summary.byScope.scope3 / summary.totalEmissions) * 100).toFixed(1)}%`],
        ["Total", summary.totalEmissions.toFixed(2), "100%"],
      ];

      autoTable(doc, {
        startY: emissionsY + 5,
        head: [emissionsData[0]],
        body: emissionsData.slice(1),
        theme: "striped",
        headStyles: { fillColor: [34, 139, 34] },
      });

      // Framework Requirements
      const reqY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${framework?.name} Requirements Checklist`, 20, reqY);

      const reqData = framework?.requirements.map((req) => [req, "☐ Pending"]) || [];

      autoTable(doc, {
        startY: reqY + 5,
        head: [["Requirement", "Status"]],
        body: reqData,
        theme: "striped",
        headStyles: { fillColor: [34, 139, 34] },
      });

      // Disclaimer
      const disclaimerY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text("This report is auto-generated and should be reviewed by sustainability professionals", 20, disclaimerY);
      doc.text("before submission. Additional documentation may be required for full compliance.", 20, disclaimerY + 5);

      // Footer
      doc.setFontSize(8);
      doc.text("Generated by Bharat Carbon | www.bharatcarbon.in", 20, 285);

      doc.save(`${framework?.id}_report_${year}.pdf`);
      toast.success(`${framework?.name} report generated successfully!`);
    } catch (error) {
      console.error("Report generation failed:", error);
      toast.error("Failed to generate report");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Compliance Reporting Hub</h1>
            <p className="text-muted-foreground mt-1">
              Generate reports for CSRD, CDP, TCFD, SEC, and other sustainability frameworks
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {summary ? `${summary.totalEmissions.toFixed(1)} tCO₂e tracked` : "No data yet"}
              </Badge>
            </div>
          )}
        </div>

        {!user ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sign in to generate reports</h3>
              <p className="text-muted-foreground mb-4">
                Create an account and track your emissions to generate compliance reports
              </p>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="frameworks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="frameworks">Reporting Frameworks</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>

            <TabsContent value="frameworks">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FRAMEWORKS.map((framework) => {
                  const Icon = framework.icon;
                  return (
                    <Card key={framework.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-lg ${framework.bgColor}`}>
                            <Icon className={`h-6 w-6 ${framework.color}`} />
                          </div>
                          <div className="flex gap-1">
                            {framework.mandatory && (
                              <Badge variant="destructive" className="text-xs">
                                Mandatory
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {framework.region}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="mt-3">{framework.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {framework.fullName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          {framework.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <p className="text-xs font-medium text-muted-foreground">
                            Key Requirements:
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {framework.requirements.slice(0, 3).map((req, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                                {req}
                              </li>
                            ))}
                            {framework.requirements.length > 3 && (
                              <li className="text-primary">
                                +{framework.requirements.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                        <Button
                          onClick={() => generateReport(framework.id)}
                          disabled={!summary || generating === framework.id}
                          className="w-full"
                        >
                          {generating === framework.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reports generated yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your generated reports will appear here for easy access
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Links */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/blog/csrd-compliance-guide" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">CSRD Compliance Guide</h3>
                    <p className="text-sm text-muted-foreground">EU reporting requirements</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/certifications" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Track Certifications</h3>
                    <p className="text-sm text-muted-foreground">B Corp, EcoVadis, SBTi</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to="/quiz" className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Readiness Quiz</h3>
                    <p className="text-sm text-muted-foreground">Assess your sustainability</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
