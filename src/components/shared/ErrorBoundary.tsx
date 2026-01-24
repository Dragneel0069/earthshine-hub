import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {this.props.section ? `Error in ${this.props.section}` : 'Something went wrong'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              This section encountered an error. The rest of the page should still work.
            </p>
            <Button onClick={this.handleReset} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Smaller inline error fallback for charts and widgets
export const ChartErrorFallback = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
    <AlertTriangle className="h-8 w-8 text-muted-foreground mb-3" />
    <p className="text-sm text-muted-foreground mb-3">Failed to load chart</p>
    {onRetry && (
      <Button onClick={onRetry} variant="ghost" size="sm">
        Retry
      </Button>
    )}
  </div>
);

// Card-level error fallback
export const CardErrorFallback = ({ title, onRetry }: { title?: string; onRetry?: () => void }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-6 text-center">
      <AlertTriangle className="h-6 w-6 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        {title ? `Failed to load ${title}` : 'Failed to load content'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="ghost" size="sm" className="mt-2">
          Retry
        </Button>
      )}
    </CardContent>
  </Card>
);
