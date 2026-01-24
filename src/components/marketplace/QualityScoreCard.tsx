import { useState } from 'react';
import { Info, Shield, Leaf, Clock, Award, AlertTriangle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { QualityScoreBreakdown, getQualityTier, getRecommendedUseCase, formatScoreBreakdown } from '@/lib/credit-quality-scoring';

interface QualityScoreCardProps {
  score: number;
  breakdown: QualityScoreBreakdown;
  compact?: boolean;
}

const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  'Additionality': <Shield className="h-4 w-4" />,
  'Permanence': <Clock className="h-4 w-4" />,
  'Verification': <Award className="h-4 w-4" />,
  'Vintage': <Clock className="h-4 w-4" />,
  'Registry': <Award className="h-4 w-4" />,
  'Leakage Risk': <AlertTriangle className="h-4 w-4" />,
  'Co-benefits': <Heart className="h-4 w-4" />,
};

export function QualityScoreCard({ score, breakdown, compact = false }: QualityScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tier = getQualityTier(score);
  const useCases = getRecommendedUseCase(score);
  const formattedBreakdown = formatScoreBreakdown(breakdown);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <div className={`text-xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-xs text-muted-foreground">/100</div>
              <Badge variant="outline" className="text-xs">
                {tier.label}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-72 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Quality Score</span>
                <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}/100</span>
              </div>
              {formattedBreakdown.map(item => (
                <div key={item.dimension} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.dimension}</span>
                    <span>{item.score}/{item.maxScore}</span>
                  </div>
                  <Progress value={item.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">/100</p>
                <Badge 
                  variant="outline" 
                  className={`${tier.tier === 'premium' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    tier.tier === 'high' ? 'bg-green-50 text-green-700 border-green-200' :
                    tier.tier === 'standard' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-orange-50 text-orange-700 border-orange-200'}`}
                >
                  {tier.label}
                </Badge>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-1" />
                {isExpanded ? 'Hide' : 'Details'}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Progress ring summary */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {formattedBreakdown.map(item => (
              <TooltipProvider key={item.dimension}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div className={`p-1.5 rounded-full ${
                        item.percentage >= 80 ? 'bg-emerald-100 text-emerald-600' :
                        item.percentage >= 60 ? 'bg-green-100 text-green-600' :
                        item.percentage >= 40 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {DIMENSION_ICONS[item.dimension]}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.dimension}: {item.score}/{item.maxScore}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <CollapsibleContent className="space-y-4">
            {/* Detailed breakdown */}
            <div className="space-y-3 pt-4 border-t">
              {formattedBreakdown.map(item => (
                <div key={item.dimension} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {DIMENSION_ICONS[item.dimension]}
                      <span className="text-sm font-medium">{item.dimension}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.score}/{item.maxScore}</span>
                  </div>
                  <Progress 
                    value={item.percentage} 
                    className={`h-2 ${getProgressColor(item.percentage)}`}
                  />
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Recommended use cases */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Recommended for:</p>
              <div className="flex flex-wrap gap-2">
                {useCases.map(useCase => (
                  <Badge key={useCase} variant="secondary" className="text-xs">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
