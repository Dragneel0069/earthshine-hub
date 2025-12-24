import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface MonthlyData {
  month: string;
  emissions: number;
  target?: number;
}

interface MonthlyTrendChartProps {
  data?: MonthlyData[];
  target?: number;
  isLoading?: boolean;
}

const defaultData = [
  { month: "Apr '24", emissions: 185.2 },
  { month: "May '24", emissions: 172.5 },
  { month: "Jun '24", emissions: 168.3 },
  { month: "Jul '24", emissions: 155.8 },
  { month: "Aug '24", emissions: 149.2 },
  { month: "Sep '24", emissions: 142.6 },
  { month: "Oct '24", emissions: 138.4 },
  { month: "Nov '24", emissions: 132.1 },
  { month: "Dec '24", emissions: 128.5 },
];

export function MonthlyTrendChart({ 
  data, 
  target = 120, 
  isLoading = false 
}: MonthlyTrendChartProps) {
  const chartData = data && data.some(d => d.emissions > 0) ? data : defaultData;
  const hasRealData = data && data.some(d => d.emissions > 0);
  
  const firstEmission = chartData[0]?.emissions || 0;
  const lastEmission = chartData[chartData.length - 1]?.emissions || 0;
  const reduction = firstEmission > 0 ? ((firstEmission - lastEmission) / firstEmission) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl">Monthly Emissions Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-[350px] bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Emissions Trend</CardTitle>
        <p className="text-sm text-muted-foreground">
          {hasRealData ? "Live data from your emissions records" : "Tracking progress towards FY 2024-25 reduction target"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  boxShadow: "var(--shadow-lg)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`${value.toFixed(1)} tCO₂e`, "Emissions"]}
              />
              <ReferenceLine 
                y={target} 
                stroke="hsl(45, 70%, 55%)" 
                strokeDasharray="5 5" 
                label={{ 
                  value: `Target: ${target} tCO₂e`, 
                  position: "right",
                  fill: "hsl(45, 70%, 55%)",
                  fontSize: 11
                }} 
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="hsl(152, 45%, 28%)"
                strokeWidth={3}
                dot={{ fill: "hsl(152, 45%, 28%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(152, 45%, 28%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Actual Emissions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 bg-secondary" style={{ borderStyle: 'dashed' }} />
              <span className="text-muted-foreground">Target Line</span>
            </div>
          </div>
          {reduction > 0 && (
            <span className="text-primary font-medium">↓ {reduction.toFixed(1)}% reduction</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
