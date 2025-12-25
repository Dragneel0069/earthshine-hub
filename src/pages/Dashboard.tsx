import { Navbar } from "@/components/layout/Navbar";
import { TotalEmissionsCounter } from "@/components/dashboard/TotalEmissionsCounter";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Dashboard3DScene } from "@/components/3d/Dashboard3DScene";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileCheck, 
  Target, 
  Leaf, 
  IndianRupee, 
  TrendingDown,
  Zap,
  Globe2,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { useEmissionsSummary } from "@/hooks/useEmissions";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { summary, isLoading } = useEmissionsSummary();

  // Placeholder stats - replace with authentic data from your database
  const statsCards = [
    {
      title: "BRSR Status",
      value: "—",
      badge: "FY 24-25",
      icon: FileCheck,
      gradient: "from-emerald-500 to-teal-600",
      trend: "—",
    },
    {
      title: "Reduction Target",
      value: "—",
      badge: "—",
      icon: Target,
      gradient: "from-blue-500 to-indigo-600",
      trend: "—",
    },
    {
      title: "Carbon Credits",
      value: "—",
      badge: "—",
      icon: Leaf,
      gradient: "from-amber-500 to-orange-600",
      trend: "—",
    },
    {
      title: "Monthly Savings",
      value: "—",
      badge: "—",
      icon: IndianRupee,
      gradient: "from-purple-500 to-pink-600",
      trend: "—",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-card/50">
        <Navbar />
        <main className="container py-8">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold font-display">Emissions Dashboard</h1>
                  <Badge variant="outline" className="gap-1 bg-card">
                    🇮🇳 India
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Track and manage your organization's carbon footprint • FY 2024-25
                </p>
              </div>
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/reports">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileCheck className="h-4 w-4" />
                    Generate Report
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="sm" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Buy Offsets
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* 3D Visualization - Spans 2 columns */}
            <ScrollReveal className="lg:col-span-2" animation="fadeRight">
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5 h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-display flex items-center gap-2">
                        <Globe2 className="h-5 w-5 text-primary" />
                        3D Emissions Overview
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Interactive visualization of your carbon footprint by scope
                      </p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Activity className="h-3 w-3" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
              <Dashboard3DScene 
                scope1={summary?.byScope.scope1 || 0}
                scope2={summary?.byScope.scope2 || 0}
                scope3={summary?.byScope.scope3 || 0}
              />
                  {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 p-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">Scope 1: {summary?.byScope.scope1?.toFixed(0) || "—"} tCO₂e</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-muted-foreground">Scope 2: {summary?.byScope.scope2?.toFixed(0) || "—"} tCO₂e</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-muted-foreground">Scope 3: {summary?.byScope.scope3?.toFixed(0) || "—"} tCO₂e</span>
                </div>
              </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Total Emissions Counter */}
            <ScrollReveal animation="fadeLeft" delay={0.1}>
              <div className="space-y-6">
                <TotalEmissionsCounter 
                  totalEmissions={summary?.totalEmissions || 0}
                  previousEmissions={0}
                  costSavings={0}
                  isLoading={isLoading}
                />
                
                {/* Quick Insight Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
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
                          Add emissions data to receive AI-powered insights and recommendations for reducing your carbon footprint.
                        </p>
                      </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats Grid */}
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8" staggerDelay={0.1}>
            {statsCards.map((stat) => (
              <StaggerItem key={stat.title}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
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
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <ScrollReveal className="lg:col-span-2" animation="fadeUp">
              <MonthlyTrendChart 
                data={summary?.monthlyTrend} 
                target={150}
                isLoading={isLoading}
              />
            </ScrollReveal>
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <QuickActions />
            </ScrollReveal>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ScrollReveal className="lg:col-span-2" animation="fadeUp">
              <RecentActivity 
                activities={summary?.recentActivity} 
                isLoading={isLoading}
              />
            </ScrollReveal>
            
            {/* CTA Card */}
            <ScrollReveal animation="fadeUp" delay={0.1}>
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
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
                  </motion.div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
