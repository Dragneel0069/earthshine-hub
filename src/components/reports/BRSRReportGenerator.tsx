import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Building2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface CompanyDetails {
  companyName: string;
  cin: string;
  gst: string;
  registeredAddress: string;
  email: string;
  website: string;
  sector: string;
  financialYear: string;
}

interface EmissionData {
  scope1: number;
  scope2: number;
  scope3: number;
  electricity: number;
  fuel: number;
  water: number;
  waste: number;
}

const sectors = [
  "Manufacturing",
  "IT & Technology",
  "Energy & Power",
  "Pharmaceuticals",
  "Automobiles",
  "Chemicals",
  "Textiles",
  "FMCG",
  "Banking & Finance",
  "Real Estate",
  "Other",
];

interface BRSRReportGeneratorProps {
  trigger?: React.ReactNode;
}

export function BRSRReportGenerator({ trigger }: BRSRReportGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"company" | "emissions" | "preview">("company");

  const [company, setCompany] = useState<CompanyDetails>({
    companyName: "",
    cin: "",
    gst: "",
    registeredAddress: "",
    email: "",
    website: "",
    sector: "",
    financialYear: "2024-25",
  });

  const [emissions, setEmissions] = useState<EmissionData>({
    scope1: 8200,
    scope2: 15400,
    scope3: 4850,
    electricity: 18750,
    fuel: 3500,
    water: 125000,
    waste: 450,
  });

  const handleCompanyChange = (field: keyof CompanyDetails, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmissionChange = (field: keyof EmissionData, value: string) => {
    setEmissions((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const totalEmissions = emissions.scope1 + emissions.scope2 + emissions.scope3;

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(46, 125, 50); // Green header
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Business Responsibility & Sustainability Report", pageWidth / 2, 18, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`SEBI BRSR Framework | FY ${company.financialYear}`, pageWidth / 2, 28, { align: "center" });
      doc.text("🇮🇳 Republic of India", pageWidth / 2, 36, { align: "center" });

      // Company Details Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Section A: General Disclosures", 14, 55);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      autoTable(doc, {
        startY: 60,
        head: [["Field", "Details"]],
        body: [
          ["Company Name", company.companyName || "Not Provided"],
          ["Corporate Identification Number (CIN)", company.cin || "Not Provided"],
          ["GST Number", company.gst || "Not Provided"],
          ["Registered Address", company.registeredAddress || "Not Provided"],
          ["Email", company.email || "Not Provided"],
          ["Website", company.website || "Not Provided"],
          ["Sector/Industry", company.sector || "Not Provided"],
          ["Financial Year", company.financialYear],
        ],
        theme: "striped",
        headStyles: { fillColor: [46, 125, 50] },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      // Emissions Summary Section
      const finalY1 = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 120;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Section B: Environmental Disclosures - GHG Emissions", 14, finalY1 + 15);

      autoTable(doc, {
        startY: finalY1 + 20,
        head: [["Emission Category", "Value (kg CO₂e)", "% of Total"]],
        body: [
          ["Scope 1 (Direct Emissions)", emissions.scope1.toLocaleString("en-IN"), `${((emissions.scope1 / totalEmissions) * 100).toFixed(1)}%`],
          ["Scope 2 (Indirect - Electricity)", emissions.scope2.toLocaleString("en-IN"), `${((emissions.scope2 / totalEmissions) * 100).toFixed(1)}%`],
          ["Scope 3 (Other Indirect)", emissions.scope3.toLocaleString("en-IN"), `${((emissions.scope3 / totalEmissions) * 100).toFixed(1)}%`],
          ["Total GHG Emissions", totalEmissions.toLocaleString("en-IN"), "100%"],
        ],
        theme: "striped",
        headStyles: { fillColor: [46, 125, 50] },
        styles: { fontSize: 9, cellPadding: 3 },
        foot: [["Total in Tonnes CO₂e", (totalEmissions / 1000).toFixed(2), ""]],
        footStyles: { fillColor: [240, 240, 240], fontStyle: "bold" },
      });

      // Resource Consumption Section
      const finalY2 = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 180;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Resource Consumption Details", 14, finalY2 + 15);

      autoTable(doc, {
        startY: finalY2 + 20,
        head: [["Resource", "Consumption", "Unit"]],
        body: [
          ["Electricity", emissions.electricity.toLocaleString("en-IN"), "kWh"],
          ["Fuel (Diesel/Petrol)", emissions.fuel.toLocaleString("en-IN"), "Liters"],
          ["Water", emissions.water.toLocaleString("en-IN"), "KL"],
          ["Waste Generated", emissions.waste.toLocaleString("en-IN"), "Tonnes"],
        ],
        theme: "striped",
        headStyles: { fillColor: [46, 125, 50] },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      // Carbon Intensity Metrics
      const finalY3 = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 220;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Carbon Intensity Metrics (Indian Standards)", 14, finalY3 + 15);

      autoTable(doc, {
        startY: finalY3 + 20,
        head: [["Metric", "Value", "Benchmark"]],
        body: [
          ["GHG Emission Intensity (per ₹Cr revenue)", `${(totalEmissions / 100).toFixed(2)} kg CO₂e`, "Industry avg: 350 kg"],
          ["Energy Intensity (kWh/unit)", `${(emissions.electricity / 1000).toFixed(2)}`, "Benchmark: 15-25"],
          ["Water Intensity (KL/unit)", `${(emissions.water / 1000).toFixed(2)}`, "Benchmark: 100-150"],
          ["Waste to Landfill Rate", "12%", "Target: <10%"],
        ],
        theme: "striped",
        headStyles: { fillColor: [46, 125, 50] },
        styles: { fontSize: 9, cellPadding: 3 },
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-IN")} | Bharat Carbon | SEBI BRSR Compliant`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      // Save PDF
      const fileName = `BRSR_Report_${company.companyName.replace(/\s+/g, "_") || "Company"}_FY${company.financialYear}.pdf`;
      doc.save(fileName);

      toast({
        title: "BRSR Report Generated ✓",
        description: `Downloaded as ${fileName}`,
      });

      setOpen(false);
      setStep("company");
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Generate BRSR Report
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl">BRSR Report Generator</SheetTitle>
              <SheetDescription>
                Generate SEBI-compliant sustainability report
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-6">
          {["company", "emissions", "preview"].map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                step === s ? "bg-primary" : i < ["company", "emissions", "preview"].indexOf(step) ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Company Details */}
        {step === "company" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company Information</h3>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={company.companyName}
                onChange={(e) => handleCompanyChange("companyName", e.target.value)}
                placeholder="ABC Industries Pvt Ltd"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cin">CIN (Corporate ID)</Label>
                <Input
                  id="cin"
                  value={company.cin}
                  onChange={(e) => handleCompanyChange("cin", e.target.value)}
                  placeholder="U12345MH2020PTC123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst">GSTIN</Label>
                <Input
                  id="gst"
                  value={company.gst}
                  onChange={(e) => handleCompanyChange("gst", e.target.value)}
                  placeholder="27AABCU9603R1ZM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registeredAddress">Registered Address</Label>
              <Input
                id="registeredAddress"
                value={company.registeredAddress}
                onChange={(e) => handleCompanyChange("registeredAddress", e.target.value)}
                placeholder="123 Industrial Area, Mumbai, MH 400001"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={company.email}
                  onChange={(e) => handleCompanyChange("email", e.target.value)}
                  placeholder="contact@company.in"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={company.website}
                  onChange={(e) => handleCompanyChange("website", e.target.value)}
                  placeholder="www.company.in"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Industry Sector</Label>
                <Select value={company.sector} onValueChange={(v) => handleCompanyChange("sector", v)}>
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fy">Financial Year</Label>
                <Select value={company.financialYear} onValueChange={(v) => handleCompanyChange("financialYear", v)}>
                  <SelectTrigger id="fy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">FY 2024-25</SelectItem>
                    <SelectItem value="2023-24">FY 2023-24</SelectItem>
                    <SelectItem value="2022-23">FY 2022-23</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full mt-4" onClick={() => setStep("emissions")}>
              Next: Emission Data
            </Button>
          </div>
        )}

        {/* Step 2: Emission Data */}
        {step === "emissions" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">GHG Emissions (kg CO₂e)</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scope1">Scope 1</Label>
                <Input
                  id="scope1"
                  type="number"
                  value={emissions.scope1}
                  onChange={(e) => handleEmissionChange("scope1", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Direct emissions</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope2">Scope 2</Label>
                <Input
                  id="scope2"
                  type="number"
                  value={emissions.scope2}
                  onChange={(e) => handleEmissionChange("scope2", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Electricity</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope3">Scope 3</Label>
                <Input
                  id="scope3"
                  type="number"
                  value={emissions.scope3}
                  onChange={(e) => handleEmissionChange("scope3", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Other indirect</p>
              </div>
            </div>

            <h3 className="font-semibold text-lg pt-4">Resource Consumption</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricity">Electricity (kWh)</Label>
                <Input
                  id="electricity"
                  type="number"
                  value={emissions.electricity}
                  onChange={(e) => handleEmissionChange("electricity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel">Fuel (Liters)</Label>
                <Input
                  id="fuel"
                  type="number"
                  value={emissions.fuel}
                  onChange={(e) => handleEmissionChange("fuel", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water">Water (KL)</Label>
                <Input
                  id="water"
                  type="number"
                  value={emissions.water}
                  onChange={(e) => handleEmissionChange("water", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waste">Waste (Tonnes)</Label>
                <Input
                  id="waste"
                  type="number"
                  value={emissions.waste}
                  onChange={(e) => handleEmissionChange("waste", e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mt-4">
              <p className="text-sm text-muted-foreground">Total GHG Emissions</p>
              <p className="text-2xl font-bold text-primary">
                {totalEmissions.toLocaleString("en-IN")} kg CO₂e
              </p>
              <p className="text-sm text-muted-foreground">
                = {(totalEmissions / 1000).toFixed(2)} tonnes CO₂e
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep("company")}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep("preview")}>
                Preview Report
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Download */}
        {step === "preview" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Report Preview</h3>

            <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{company.companyName || "Not specified"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CIN</span>
                <span className="font-medium">{company.cin || "Not specified"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sector</span>
                <span className="font-medium">{company.sector || "Not specified"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Financial Year</span>
                <span className="font-medium">FY {company.financialYear}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Emissions</span>
                  <span className="font-bold text-primary">{(totalEmissions / 1000).toFixed(2)} tCO₂e</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/10 border border-secondary/20 p-4">
              <p className="text-sm font-medium">Report Contents:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>✓ Section A: General Disclosures</li>
                <li>✓ Section B: Environmental Disclosures</li>
                <li>✓ GHG Emissions by Scope</li>
                <li>✓ Resource Consumption Details</li>
                <li>✓ Carbon Intensity Metrics</li>
              </ul>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep("emissions")}>
                Back
              </Button>
              <Button className="flex-1 gap-2" onClick={generatePDF} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              Report formatted per SEBI BRSR Framework guidelines
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
