import { useState, useCallback, useRef } from 'react';
import { ClientRateLimiter, logSecurityEvent } from '@/lib/security';
import { useToast } from './use-toast';

interface UseRateLimiterOptions {
  maxAttempts?: number;
  windowMs?: number;
  key: string;
}

/**
 * Hook for client-side rate limiting on forms/actions
 */
export function useRateLimiter(options: UseRateLimiterOptions) {
  const { maxAttempts = 5, windowMs = 60000, key } = options;
  const limiterRef = useRef(new ClientRateLimiter(maxAttempts, windowMs));
  const [isLimited, setIsLimited] = useState(false);
  const [waitTimeMs, setWaitTimeMs] = useState(0);
  const { toast } = useToast();

  const checkLimit = useCallback((): boolean => {
    const result = limiterRef.current.canAttempt(key);
    
    if (!result.allowed) {
      setIsLimited(true);
      setWaitTimeMs(result.waitMs);
      
      const waitSeconds = Math.ceil(result.waitMs / 1000);
      
      logSecurityEvent({
        type: 'rate_limit',
        message: `Client-side rate limit triggered for ${key}`,
        details: { waitSeconds },
        timestamp: Date.now(),
      });

      toast({
        variant: 'destructive',
        title: 'Too Many Attempts',
        description: `Please wait ${waitSeconds} seconds before trying again.`,
      });

      // Auto-reset the limited state
      setTimeout(() => {
        setIsLimited(false);
        setWaitTimeMs(0);
      }, result.waitMs);

      return false;
    }

    setIsLimited(false);
    setWaitTimeMs(0);
    return true;
  }, [key, toast]);

  const reset = useCallback(() => {
    limiterRef.current.reset(key);
    setIsLimited(false);
    setWaitTimeMs(0);
  }, [key]);

  return {
    checkLimit,
    reset,
    isLimited,
    waitTimeMs,
    waitTimeSeconds: Math.ceil(waitTimeMs / 1000),
  };
}
