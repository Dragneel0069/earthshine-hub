import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface EmissionsByScopeProps {
  scope1?: number;
  scope2?: number;
  scope3?: number;
  isLoading?: boolean;
}

export function EmissionsByScope({ 
  scope1 = 0, 
  scope2 = 0, 
  scope3 = 0, 
  isLoading = false 
}: EmissionsByScopeProps) {
  const total = scope1 + scope2 + scope3;

  const data = [
    { name: "Scope 1 (Direct)", value: total > 0 ? (scope1 / total) * 100 : 42, color: "hsl(152, 45%, 28%)", description: "Owned sources", rawValue: scope1 },
    { name: "Scope 2 (Indirect)", value: total > 0 ? (scope2 / total) * 100 : 35, color: "hsl(152, 45%, 45%)", description: "Purchased energy", rawValue: scope2 },
    { name: "Scope 3 (Value Chain)", value: total > 0 ? (scope3 / total) * 100 : 23, color: "hsl(45, 70%, 55%)", description: "Supply chain", rawValue: scope3 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Emissions by Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-[300px] bg-muted rounded-full w-[200px] mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Emissions by Scope</CardTitle>
        <p className="text-sm text-muted-foreground">
          GHG Protocol classification breakdown
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                }}
                formatter={(value: number, name: string, props: { payload: { rawValue: number } }) => [
                  `${value.toFixed(1)}% (${props.payload.rawValue.toFixed(1)} tCO₂e)`, 
                  name
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((scope) => (
            <div key={scope.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: scope.color }}
                />
                <span className="text-muted-foreground">{scope.description}</span>
              </div>
              <span className="font-medium">{scope.value.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
