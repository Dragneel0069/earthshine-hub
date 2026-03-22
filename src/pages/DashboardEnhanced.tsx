import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileCheck, 
  Download, 
  Settings,
  TrendingDown,
  Leaf,
  Building2,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/shared/SEO';

// Import new dashboard components
import { EmissionsOverview } from '@/components/dashboard/EmissionsOverview';
import { EmissionsBreakdownChart } from '@/components/dashboard/EmissionsBreakdownChart';
import { EmissionsTrendChart } from '@/components/dashboard/EmissionsTrendChart';
import { ReductionTargets } from '@/components/dashboard/ReductionTargets';
import { EmissionsByCategory } from '@/components/dashboard/EmissionsByCategory';

// Import mock data
import { 
  mockCurrentFootprint, 
  mockPreviousFootprint,
  mockEmissionSources,
  mockReductionTargets,
  mockMonthlyTrend
} from '@/data/mock-emissions';

const DashboardEnhanced = () => {
  return (
    <>
      <SEO 
        title="Carbon Dashboard - India Climate Intelligence"
        url="/dashboard"
        description="Comprehensive carbon accounting dashboard for Indian enterprises with Scope 1, 2, 3 emissions tracking and BRSR compliance."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <main className="container py-8 space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold font-display">
                    Carbon Intelligence Dashboard
                  </h1>
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
          <div>
            <EmissionsOverview 
              currentFootprint={mockCurrentFootprint}
              previousFootprint={mockPreviousFootprint}
            />
          </div>

          {/* Main Content Tabs */}
          <div>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="targets">Targets</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  <EmissionsBreakdownChart footprint={mockCurrentFootprint} />
                  <ReductionTargets targets={mockReductionTargets} />
                  <EmissionsByCategory sources={mockEmissionSources} />
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
                <EmissionsTrendChart data={mockMonthlyTrend} />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Seasonal Patterns</CardTitle>
                      <CardDescription>Emissions variation by season</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Summer (Apr-Jun)</span>
                          <span className="font-medium">135.4 tCO₂e/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Monsoon (Jul-Sep)</span>
                          <span className="font-medium">125.3 tCO₂e/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Winter (Oct-Dec)</span>
                          <span className="font-medium">120.5 tCO₂e/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Spring (Jan-Mar)</span>
                          <span className="font-medium">129.5 tCO₂e/month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Drivers</CardTitle>
                      <CardDescription>Main factors affecting emissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                          <div>
                            <p className="text-sm font-medium">Cooling Load</p>
                            <p className="text-xs text-muted-foreground">
                              Summer months show 12% higher electricity consumption
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-warning mt-1.5" />
                          <div>
                            <p className="text-sm font-medium">Business Travel</p>
                            <p className="text-xs text-muted-foreground">
                              Q4 shows increased travel for year-end activities
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                          <div>
                            <p className="text-sm font-medium">Renewable Energy</p>
                            <p className="text-xs text-muted-foreground">
                              Solar generation peaks in summer, reducing grid dependency
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Targets Tab */}
              <TabsContent value="targets" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reduction Roadmap</CardTitle>
                      <CardDescription>Pathway to net-zero by 2050</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">2025 Target</span>
                            <span className="text-muted-foreground">1,450 tCO₂e</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-success" style={{ width: '93%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">2030 Target</span>
                            <span className="text-muted-foreground">1,218 tCO₂e</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '35%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">2040 Target</span>
                            <span className="text-muted-foreground">420 tCO₂e</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-warning" style={{ width: '15%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">2050 Target</span>
                            <span className="text-muted-foreground">Net Zero</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-muted-foreground" style={{ width: '5%' }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <ReductionTargets targets={mockReductionTargets} />
                </div>
              </TabsContent>

              {/* Sources Tab */}
              <TabsContent value="sources" className="space-y-6">
                <EmissionsByCategory sources={mockEmissionSources} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Emission Sources Detail</CardTitle>
                    <CardDescription>Complete breakdown of all emission sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockEmissionSources.slice(0, 5).map((source) => (
                        <div key={source.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{source.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {source.scope.replace('scope', 'Scope ')}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {source.description} • {source.amount.toLocaleString()} {source.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{(source.totalEmissions / 1000).toFixed(2)} tCO₂e</p>
                            <p className="text-xs text-muted-foreground">{source.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Sources
                    </Button>
                  </CardContent>
                </Card>
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
                <CardDescription>
                  AI-powered recommendations to reduce your carbon footprint
                </CardDescription>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
};

export default DashboardEnhanced;
