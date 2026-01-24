import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CarbonFootprint } from '@/types/carbon';

interface EmissionsBreakdownChartProps {
  footprint: CarbonFootprint;
}

const COLORS = {
  scope1: 'hsl(var(--destructive))',
  scope2: 'hsl(var(--warning))',
  scope3: 'hsl(var(--primary))',
};

export const EmissionsBreakdownChart = ({ footprint }: EmissionsBreakdownChartProps) => {
  const data = [
    { name: 'Scope 1', value: footprint.scope1, color: COLORS.scope1 },
    { name: 'Scope 2', value: footprint.scope2, color: COLORS.scope2 },
    { name: 'Scope 3', value: footprint.scope3, color: COLORS.scope3 },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value.toFixed(2)} tCO₂e ({((data.value / footprint.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Emissions Breakdown</CardTitle>
        <CardDescription>Distribution across scopes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value.toFixed(2)} tCO₂e</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
