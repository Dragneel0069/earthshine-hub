import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Zap, Factory, Recycle, Plane, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Emission {
  id: string;
  category: string;
  scope: number;
  quantity: number;
  unit: string;
  co2e: number;
  created_at: string;
}

interface RecentActivityProps {
  activities?: Emission[];
  isLoading?: boolean;
}

const defaultActivities = [
  {
    id: "1",
    title: "Fleet Vehicle Update",
    description: "Added 2 electric vehicles to fleet",
    impact: "-120 kg CO₂",
    impactType: "positive" as const,
    icon: Truck,
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "Energy Usage Spike",
    description: "Data center consumption increased",
    impact: "+340 kg CO₂",
    impactType: "negative" as const,
    icon: Zap,
    time: "5 hours ago",
  },
  {
    id: "3",
    title: "Manufacturing Report",
    description: "Monthly production emissions logged",
    impact: "2,450 kg CO₂",
    impactType: "neutral" as const,
    icon: Factory,
    time: "1 day ago",
  },
  {
    id: "4",
    title: "Waste Recycling",
    description: "Office recycling program update",
    impact: "-45 kg CO₂",
    impactType: "positive" as const,
    icon: Recycle,
    time: "2 days ago",
  },
  {
    id: "5",
    title: "Business Travel",
    description: "Team conference attendance",
    impact: "+890 kg CO₂",
    impactType: "negative" as const,
    icon: Plane,
    time: "3 days ago",
  },
];

const categoryIcons: Record<string, typeof Activity> = {
  "Transport": Truck,
  "Electricity": Zap,
  "Manufacturing": Factory,
  "Waste": Recycle,
  "Travel": Plane,
};

export function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  const hasRealData = activities && activities.length > 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-4 rounded-lg p-3 bg-muted">
              <div className="h-10 w-10 bg-muted-foreground/20 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (hasRealData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest emissions data entries from your records
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = categoryIcons[activity.category] || Activity;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="rounded-lg bg-accent p-2.5">
                  <IconComponent className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate">{activity.category}</p>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      Scope {activity.scope}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.quantity} {activity.unit}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {activity.co2e.toFixed(2)} tCO₂e
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // Show default activities when no real data
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest emissions data entries and updates
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {defaultActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <div className="rounded-lg bg-accent p-2.5">
              <activity.icon className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm truncate">{activity.title}</p>
                <Badge
                  variant={
                    activity.impactType === "positive"
                      ? "default"
                      : activity.impactType === "negative"
                      ? "destructive"
                      : "secondary"
                  }
                  className="shrink-0 text-xs"
                >
                  {activity.impact}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
