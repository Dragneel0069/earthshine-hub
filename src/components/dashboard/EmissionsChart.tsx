import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", emissions: 4200, target: 4000 },
  { month: "Feb", emissions: 3800, target: 3900 },
  { month: "Mar", emissions: 4100, target: 3800 },
  { month: "Apr", emissions: 3600, target: 3700 },
  { month: "May", emissions: 3200, target: 3600 },
  { month: "Jun", emissions: 2800, target: 3500 },
  { month: "Jul", emissions: 2600, target: 3400 },
  { month: "Aug", emissions: 2400, target: 3300 },
  { month: "Sep", emissions: 2200, target: 3200 },
  { month: "Oct", emissions: 2100, target: 3100 },
  { month: "Nov", emissions: 1900, target: 3000 },
  { month: "Dec", emissions: 1700, target: 2900 },
];

export function EmissionsChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Carbon Emissions Over Time</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly CO₂ emissions compared to your reduction targets
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 45%, 28%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(152, 45%, 28%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 70%, 55%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(45, 70%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  boxShadow: "var(--shadow-lg)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="hsl(45, 70%, 55%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#targetGradient)"
                strokeDasharray="5 5"
                name="Target"
              />
              <Area
                type="monotone"
                dataKey="emissions"
                stroke="hsl(152, 45%, 28%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#emissionsGradient)"
                name="Emissions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
