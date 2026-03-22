import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { TotalEmissionsCounter } from "@/components/dashboard/TotalEmissionsCounter";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { EmissionsByScope } from "@/components/dashboard/EmissionsByScope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, 
  Target, 
  Leaf, 
  IndianRupee, 
  TrendingDown,
  Zap,
  Globe2,
  ArrowUpRight,
  Activity,
  Download,
  Settings,
  Building2,
  Calendar
} from "lucide-react";
import { useEmissionsSummary } from "@/hooks/useEmissions";
import { Link } from "react-router-dom";
import { SEO } from "@/components/shared/SEO";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

// Import new dashboard components
import { EmissionsOverview } from "@/components/dashboard/EmissionsOverview";
import { EmissionsBreakdownChart } from "@/components/dashboard/EmissionsBreakdownChart";
import { EmissionsTrendChart } from "@/components/dashboard/EmissionsTrendChart";
import { ReductionTargets } from "@/components/dashboard/ReductionTargets";
import { EmissionsByCategory } from "@/components/dashboard/EmissionsByCategory";
import { AccountingIntegrations } from "@/components/integrations/AccountingIntegrations";

// Import mock data
import { 
  mockCurrentFootprint, 
  mockPreviousFootprint,
  mockEmissionSources,
  mockReductionTargets,
  mockMonthlyTrend
} from "@/data/mock-emissions";

const Dashboard = () => {
  const { summary, isLoading: isDataLoading } = useEmissionsSummary();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = isInitialLoading || isDataLoading;

  const statsCards = [
    {
      title: "BRSR Status",
      value: "Compliant",
      badge: "FY 24-25",
      icon: FileCheck,
      gradient: "from-emerald-500 to-teal-600",
      trend: "+12%",
    },
    {
      title: "Reduction Target",
      value: "30%",
      badge: summary && summary.totalEmissions < 1500 ? "On Track" : "Behind",
      icon: Target,
      gradient: "from-blue-500 to-indigo-600",
      trend: "-8%",
    },
    {
      title: "Carbon Credits",
      value: "850",
      badge: "Available",
      icon: Leaf,
      gradient: "from-amber-500 to-orange-600",
      trend: "+24%",
    },
    {
      title: "Monthly Savings",
      value: "₹12.5L",
      badge: "+18%",
      icon: IndianRupee,
      gradient: "from-purple-500 to-pink-600",
      trend: "+18%",
    },
  ];

  return (
    <>
      <SEO 
        title="Emissions Dashboard"
        url="/dashboard"
        description="Monitor and manage your organization's carbon emissions with real-time analytics, trend charts, and actionable insights."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-card/50">
        <Navbar />
        <main className="container py-8">
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
          {/* Header */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold font-display">Carbon Intelligence Dashboard</h1>
                  <Badge variant="outline" className="gap-1.5 bg-card">
                    <span className="text-base">🇮🇳</span>
                    <span>India</span>
                  </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Financial Year 2024-25 • Real-time emissions tracking
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/reports">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileCheck className="h-4 w-4" />
                    BRSR Report
                  </Button>
                </Link>
                <Button size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <ErrorBoundary section="Emissions Overview">
            <div>
              <EmissionsOverview 
                currentFootprint={mockCurrentFootprint}
                previousFootprint={mockPreviousFootprint}
              />
            </div>
          </ErrorBoundary>

          {/* Enhanced Analytics Section */}
          <div>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="3d">3D View</TabsTrigger>
                <TabsTrigger value="legacy">Legacy</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <ErrorBoundary section="Breakdown Chart">
                    <EmissionsBreakdownChart footprint={mockCurrentFootprint} />
                  </ErrorBoundary>
                  <ErrorBoundary section="Reduction Targets">
                    <ReductionTargets targets={mockReductionTargets} />
                  </ErrorBoundary>
                  <ErrorBoundary section="Category Chart">
                    <EmissionsByCategory sources={mockEmissionSources} />
                  </ErrorBoundary>
                </div>

                {/* Quick Insights */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-l-4 border-l-success">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-success" />
                        Year-over-Year Reduction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">-8.0%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        134.4 tCO₂e reduction from FY 23-24
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-primary" />
                        Carbon Intensity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.1 tCO₂e</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Per employee • 18% below industry avg
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-warning">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-warning" />
                        BRSR Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        8 of 9 principles fully compliant
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <ErrorBoundary section="Emissions Trend">
                  <EmissionsTrendChart data={mockMonthlyTrend} />
                </ErrorBoundary>
                <ErrorBoundary section="Monthly Trend">
                  <MonthlyTrendChart 
                    data={summary?.monthlyTrend} 
                    target={150}
                    isLoading={isLoading}
                  />
                </ErrorBoundary>
              </TabsContent>

              {/* 3D View Tab */}
              <TabsContent value="3d" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* 3D Visualization - Spans 2 columns */}
            <div className="lg:col-span-2">
                <EmissionsByScope />
            </div>

            {/* Total Emissions Counter */}
            <div>
              <div className="space-y-6">
                <TotalEmissionsCounter 
                  totalEmissions={summary?.totalEmissions || 0}
                  previousEmissions={1852.3}
                  costSavings={summary ? Math.round(summary.totalEmissions * 850) : 0}
                  isLoading={isLoading}
                />
                
                {/* Quick Insight Card */}
                <div
                >
                  <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <TrendingDown className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">AI Insight</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your emissions are 12% lower than the industry average. Consider investing in renewable energy to further reduce Scope 2.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statsCards.map((stat) => (
              <div key={stat.title}>
                <div
                >
                  <Card 
                    className="group relative overflow-hidden border-0 bg-card hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-medium"
                        >
                          {stat.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold font-display">{stat.value}</p>
                        <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                          {stat.trend}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2">
              <ErrorBoundary section="Monthly Trend Chart">
                <MonthlyTrendChart 
                  data={summary?.monthlyTrend} 
                  target={150}
                  isLoading={isLoading}
                />
              </ErrorBoundary>
            </div>
            <div>
              <ErrorBoundary section="Quick Actions">
                <QuickActions />
              </ErrorBoundary>
            </div>
          </div>
              </TabsContent>

              {/* Legacy View Tab */}
              <TabsContent value="legacy" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ErrorBoundary section="Recent Activity">
                      <RecentActivity 
                        activities={summary?.recentActivity} 
                        isLoading={isLoading}
                      />
                    </ErrorBoundary>
                  </div>
                  
                  {/* CTA Card */}
                  <div>
                    <Card className="border-0 bg-gradient-to-br from-primary via-emerald-600 to-teal-600 text-white overflow-hidden relative">
                      <div className="absolute inset-0 opacity-20">
                        <div 
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                            backgroundSize: '20px 20px',
                          }}
                        />
                      </div>
                      <CardContent className="p-6 relative z-10">
                        <div
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Zap className="h-8 w-8" />
                            <span className="text-sm font-medium opacity-90">Pro Feature</span>
                          </div>
                          <h3 className="text-xl font-bold font-display mb-2">
                            Unlock Advanced Analytics
                          </h3>
                          <p className="text-sm opacity-80 mb-6">
                            Get AI-powered predictions, automated BRSR reports, and priority support.
                          </p>
                          <Button variant="secondary" className="w-full gap-2">
                            Upgrade to Pro
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Items */}
          <div>
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Recommended Actions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-powered recommendations to reduce your carbon footprint
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Switch to Renewable Energy</h4>
                      <p className="text-xs text-muted-foreground">
                        Installing 200 kW solar can reduce Scope 2 emissions by 45% (171 tCO₂e/year)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Optimize Fleet Management</h4>
                      <p className="text-xs text-muted-foreground">
                        Transition 30% of fleet to EVs can save 28 tCO₂e/year and ₹4.2L in fuel costs
                      </p>
                    </div>
477:                   </div>
478:                 </div>
479:               </CardContent>
480:             </Card>
481:           </div>
482: 
483:           {/* Integrations Quick Access */}
484:           <div>
485:             <AccountingIntegrations compact />
486:           </div>
            </>
          )}
        </main>
      </div>
  );
};

export default Dashboard;
