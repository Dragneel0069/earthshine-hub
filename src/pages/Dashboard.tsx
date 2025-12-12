import { Navbar } from "@/components/layout/Navbar";
import { TotalEmissionsCounter } from "@/components/dashboard/TotalEmissionsCounter";
import { EmissionsByScope } from "@/components/dashboard/EmissionsByScope";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Target, Leaf, IndianRupee } from "lucide-react";

const statsCards = [
  {
    title: "BRSR Status",
    value: "Compliant",
    badge: "FY 24-25",
    icon: FileCheck,
    color: "text-primary",
  },
  {
    title: "Reduction Target",
    value: "30%",
    badge: "On Track",
    icon: Target,
    color: "text-secondary",
  },
  {
    title: "Carbon Credits",
    value: "850",
    badge: "Available",
    icon: Leaf,
    color: "text-primary",
  },
  {
    title: "Monthly Savings",
    value: "₹12.5L",
    badge: "+18%",
    icon: IndianRupee,
    color: "text-secondary",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-display">Emissions Dashboard</h1>
            <Badge variant="outline" className="gap-1">
              🇮🇳 India
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Track and manage your organization's carbon footprint • FY 2024-25
          </p>
        </div>

        {/* Total Emissions Counter */}
        <div className="mb-8">
          <TotalEmissionsCounter 
            totalEmissions={1284.5}
            previousEmissions={1852.3}
            costSavings={1250000}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold font-display">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {stat.badge}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <MonthlyTrendChart />
          <EmissionsByScope />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <QuickActions />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
