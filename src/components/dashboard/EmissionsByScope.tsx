import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Scope 1 (Direct)", value: 42, color: "hsl(152, 45%, 28%)", description: "Owned sources" },
  { name: "Scope 2 (Indirect)", value: 35, color: "hsl(152, 45%, 45%)", description: "Purchased energy" },
  { name: "Scope 3 (Value Chain)", value: 23, color: "hsl(45, 70%, 55%)", description: "Supply chain" },
];

export function EmissionsByScope() {
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
                formatter={(value: number, name: string) => [`${value}%`, name]}
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
              <span className="font-medium">{scope.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
