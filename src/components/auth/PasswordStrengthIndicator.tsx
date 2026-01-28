import { useMemo } from 'react';
import { evaluatePasswordStrength } from '@/lib/security';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);

  if (!password) return null;

  const getStrengthColor = (score: number): string => {
    if (score <= 1) return 'bg-destructive';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-primary';
  };

  const getStrengthLabel = (score: number): string => {
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Strength bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              level <= strength.score ? getStrengthColor(strength.score) : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Strength label */}
      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          'font-medium',
          strength.score <= 1 && 'text-destructive',
          strength.score === 2 && 'text-orange-500',
          strength.score === 3 && 'text-yellow-600',
          strength.score >= 4 && 'text-primary'
        )}>
          {getStrengthLabel(strength.score)}
        </span>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {strength.feedback.slice(0, 2).map((feedback, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-muted-foreground">•</span>
              {feedback}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
