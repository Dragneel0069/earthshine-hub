import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingDown, Building2, Truck, Zap, Factory } from "lucide-react";
import { BRSRReportGenerator } from "@/components/reports/BRSRReportGenerator";

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
  { icon: Building2, label: "Scope 1", value: "8,200 kg", change: "-12%" },
  { icon: Zap, label: "Scope 2", value: "15,400 kg", change: "-22%" },
  { icon: Truck, label: "Scope 3", value: "4,850 kg", change: "-8%" },
  { icon: Factory, label: "Total", value: "28,450 kg", change: "-18%" },
];

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
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
          <BRSRReportGenerator
            trigger={
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Generate BRSR Report
              </Button>
            }
          />
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
