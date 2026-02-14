import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Building2, Truck, Zap, Factory, FileSpreadsheet, Table2 } from "lucide-react";
import { BRSRReportGenerator } from "@/components/reports/BRSRReportGenerator";
import { SEO } from "@/components/shared/SEO";
import { exportCSV, exportExcel, type ExportColumn } from "@/lib/export-utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const reports = [
  {
    id: 1,
    title: "Annual Sustainability Report 2024",
    description: "Comprehensive overview of yearly emissions and reduction initiatives",
    date: "December 2024",
    status: "Ready",
    type: "Annual",
  },
  {
    id: 2,
    title: "Q4 2024 Emissions Summary",
    description: "Quarterly breakdown by category and department",
    date: "October 2024",
    status: "Ready",
    type: "Quarterly",
  },
  {
    id: 3,
    title: "Carbon Offset Certificate",
    description: "Verified carbon offset documentation",
    date: "November 2024",
    status: "Ready",
    type: "Certificate",
  },
  {
    id: 4,
    title: "Q1 2025 Emissions Summary",
    description: "Upcoming quarterly report",
    date: "April 2025",
    status: "Pending",
    type: "Quarterly",
  },
];

const quickStats = [
  { icon: Building2, label: "Scope 1", value: "8,200 kg", change: "-12%", raw: 8200 },
  { icon: Zap, label: "Scope 2", value: "15,400 kg", change: "-22%", raw: 15400 },
  { icon: Truck, label: "Scope 3", value: "4,850 kg", change: "-8%", raw: 4850 },
  { icon: Factory, label: "Total", value: "28,450 kg", change: "-18%", raw: 28450 },
];

const emissionsColumns: ExportColumn[] = [
  { header: "Scope", key: "scope" },
  { header: "Emissions (kg CO₂e)", key: "emissions" },
  { header: "Change (%)", key: "change" },
];

const reportColumns: ExportColumn[] = [
  { header: "Report Title", key: "title" },
  { header: "Description", key: "description" },
  { header: "Date", key: "date" },
  { header: "Status", key: "status" },
  { header: "Type", key: "type" },
];

const getEmissionsExportData = () =>
  quickStats.map((s) => ({
    scope: s.label,
    emissions: s.raw,
    change: s.change,
  }));

const getReportsExportData = () =>
  reports.map((r) => ({
    title: r.title,
    description: r.description,
    date: r.date,
    status: r.status,
    type: r.type,
  }));

const handleExport = (format: "csv" | "excel", type: "emissions" | "reports") => {
  const isEmissions = type === "emissions";
  const data = isEmissions ? getEmissionsExportData() : getReportsExportData();
  const columns = isEmissions ? emissionsColumns : reportColumns;
  const filename = isEmissions ? "emissions_summary" : "reports_list";
  const sheetName = isEmissions ? "Emissions" : "Reports";

  if (format === "csv") {
    exportCSV(data, columns, filename);
  } else {
    exportExcel(data, columns, filename, sheetName);
  }
  toast.success(`${sheetName} exported as ${format === "csv" ? "CSV" : "Excel"}`);
};

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Emissions Reports"
        url="/reports"
        description="Generate and download BRSR-compliant sustainability reports, quarterly emissions summaries, and carbon offset certificates."
        noIndex={true}
      />
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generate and download emissions reports
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleExport("csv", "emissions")}>
                  <Table2 className="h-4 w-4 mr-2" />
                  Emissions Summary (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel", "emissions")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Emissions Summary (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv", "reports")}>
                  <Table2 className="h-4 w-4 mr-2" />
                  Reports List (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel", "reports")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Reports List (Excel)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <BRSRReportGenerator
              trigger={
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generate BRSR Report
                </Button>
              }
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent p-2.5">
                    <stat.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold font-display">{stat.value}</span>
                      <span className="text-sm text-success font-medium">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              Download your emissions reports and certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-accent p-3">
                      <FileText className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </span>
                        <Badge variant={report.status === "Ready" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={report.status === "Ready" ? "default" : "secondary"}
                    size="sm"
                    className="gap-2 shrink-0"
                    disabled={report.status !== "Ready"}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
