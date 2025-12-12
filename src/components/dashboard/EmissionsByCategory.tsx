import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Transportation", value: 35, color: "hsl(152, 45%, 28%)" },
  { name: "Energy", value: 28, color: "hsl(152, 45%, 45%)" },
  { name: "Manufacturing", value: 20, color: "hsl(45, 70%, 55%)" },
  { name: "Waste", value: 12, color: "hsl(200, 80%, 50%)" },
  { name: "Other", value: 5, color: "hsl(150, 10%, 60%)" },
];

export function EmissionsByCategory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Emissions by Category</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of your carbon footprint sources
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
                formatter={(value: number) => [`${value}%`, "Share"]}
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
      </CardContent>
    </Card>
  );
}
