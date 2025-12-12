import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Zap, Factory, Recycle, Plane } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Fleet Vehicle Update",
    description: "Added 2 electric vehicles to fleet",
    impact: "-120 kg CO₂",
    impactType: "positive" as const,
    icon: Truck,
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Energy Usage Spike",
    description: "Data center consumption increased",
    impact: "+340 kg CO₂",
    impactType: "negative" as const,
    icon: Zap,
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Manufacturing Report",
    description: "Monthly production emissions logged",
    impact: "2,450 kg CO₂",
    impactType: "neutral" as const,
    icon: Factory,
    time: "1 day ago",
  },
  {
    id: 4,
    title: "Waste Recycling",
    description: "Office recycling program update",
    impact: "-45 kg CO₂",
    impactType: "positive" as const,
    icon: Recycle,
    time: "2 days ago",
  },
  {
    id: 5,
    title: "Business Travel",
    description: "Team conference attendance",
    impact: "+890 kg CO₂",
    impactType: "negative" as const,
    icon: Plane,
    time: "3 days ago",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest emissions data entries and updates
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
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
