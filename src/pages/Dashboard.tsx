import { Navbar } from "@/components/layout/Navbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmissionsChart } from "@/components/dashboard/EmissionsChart";
import { EmissionsByCategory } from "@/components/dashboard/EmissionsByCategory";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { CloudCog, Leaf, Target, TrendingDown, Plus } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Emissions Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your organization's carbon footprint
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Log Emissions
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Emissions (YTD)"
            value="28,450 kg"
            change="↓ 18% vs last year"
            changeType="positive"
            icon={CloudCog}
          />
          <StatsCard
            title="Carbon Offset"
            value="12,200 kg"
            change="43% of total"
            changeType="neutral"
            icon={Leaf}
          />
          <StatsCard
            title="Reduction Target"
            value="35,000 kg"
            change="On track"
            changeType="positive"
            icon={Target}
          />
          <StatsCard
            title="Monthly Trend"
            value="-8.5%"
            change="Best month this year"
            changeType="positive"
            icon={TrendingDown}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <EmissionsChart />
          <EmissionsByCategory />
        </div>

        {/* Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentActivity />
          <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-display mb-2">
              You're making progress!
            </h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Your emissions are down 18% compared to last year. Keep up the great work towards your sustainability goals.
            </p>
            <Button variant="outline" className="gap-2">
              View Full Report
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
