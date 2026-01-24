import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ReductionTarget } from '@/types/carbon';
import { Target, TrendingDown, AlertCircle } from 'lucide-react';

interface ReductionTargetsProps {
  targets: ReductionTarget[];
}

export const ReductionTargets = ({ targets }: ReductionTargetsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-success text-success-foreground';
      case 'at_risk':
        return 'bg-warning text-warning-foreground';
      case 'off_track':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <TrendingDown className="h-4 w-4" />;
      case 'at_risk':
        return <AlertCircle className="h-4 w-4" />;
      case 'off_track':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'at_risk':
        return 'At Risk';
      case 'off_track':
        return 'Off Track';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Reduction Targets</CardTitle>
        <CardDescription>Progress towards net-zero goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {targets.map((target) => (
          <div key={target.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium">{target.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {target.baselineYear} → {target.targetYear} ({target.targetReduction}% reduction)
                </p>
              </div>
              <Badge className={getStatusColor(target.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(target.status)}
                  {getStatusLabel(target.status)}
                </span>
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{target.currentProgress.toFixed(1)}%</span>
              </div>
              <Progress value={target.currentProgress} className="h-2" />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Baseline: {target.baselineEmissions.toFixed(0)} tCO₂e</span>
              <span>Target: {(target.baselineEmissions * (1 - target.targetReduction / 100)).toFixed(0)} tCO₂e</span>
            </div>
          </div>
        ))}
        {targets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reduction targets set</p>
            <p className="text-xs">Set targets to track your progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
