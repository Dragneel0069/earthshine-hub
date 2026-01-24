import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { EmissionSource } from '@/types/carbon';

interface EmissionsByCategoryProps {
  sources: EmissionSource[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Electricity': 'hsl(var(--primary))',
  'Fuel': 'hsl(var(--destructive))',
  'Transport': 'hsl(var(--warning))',
  'Waste': 'hsl(var(--success))',
  'Water': 'hsl(var(--info))',
  'Supply Chain': 'hsl(var(--secondary))',
  'Other': 'hsl(var(--muted))',
};

export const EmissionsByCategory = ({ sources }: EmissionsByCategoryProps) => {
  // Aggregate emissions by category
  const categoryData = sources.reduce((acc, source) => {
    const existing = acc.find(item => item.category === source.category);
    if (existing) {
      existing.emissions += source.totalEmissions / 1000; // Convert to tonnes
    } else {
      acc.push({
        category: source.category,
        emissions: source.totalEmissions / 1000,
      });
    }
    return acc;
  }, [] as { category: string; emissions: number }[]);

  // Sort by emissions descending
  categoryData.sort((a, b) => b.emissions - a.emissions);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.payload.category}</p>
          <p className="text-sm text-muted-foreground">
            {data.value.toFixed(2)} tCO₂e
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Emissions by Category</CardTitle>
        <CardDescription>Top emission sources</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'tCO₂e', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="category" 
              dataKey="category" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="emissions" radius={[0, 4, 4, 0]}>
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Other} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
