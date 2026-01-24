import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { CarbonFootprint } from '@/types/carbon';

interface EmissionsOverviewProps {
  currentFootprint: CarbonFootprint;
  previousFootprint?: CarbonFootprint;
}

export const EmissionsOverview = ({ currentFootprint, previousFootprint }: EmissionsOverviewProps) => {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const totalChange = calculateChange(currentFootprint.total, previousFootprint?.total);

  const getTrendIcon = (change: number | null) => {
    if (change === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-success" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number | null) => {
    if (change === null) return 'text-muted-foreground';
    if (change > 0) return 'text-destructive';
    if (change < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  const formatChange = (change: number | null) => {
    if (change === null) return 'N/A';
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
          {getTrendIcon(totalChange)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentFootprint.total.toFixed(2)} tCO₂e</div>
          <p className={`text-xs ${getTrendColor(totalChange)}`}>
            {formatChange(totalChange)} from last period
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scope 1</CardTitle>
          {getTrendIcon(calculateChange(currentFootprint.scope1, previousFootprint?.scope1))}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentFootprint.scope1.toFixed(2)} tCO₂e</div>
          <p className="text-xs text-muted-foreground">
            Direct emissions
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scope 2</CardTitle>
          {getTrendIcon(calculateChange(currentFootprint.scope2, previousFootprint?.scope2))}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentFootprint.scope2.toFixed(2)} tCO₂e</div>
          <p className="text-xs text-muted-foreground">
            Indirect (energy)
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scope 3</CardTitle>
          {getTrendIcon(calculateChange(currentFootprint.scope3, previousFootprint?.scope3))}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentFootprint.scope3.toFixed(2)} tCO₂e</div>
          <p className="text-xs text-muted-foreground">
            Value chain
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
