import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { 
  SessionActivityTracker, 
  SESSION_CONFIG,
  logSecurityEvent 
} from '@/lib/security';

/**
 * Hook for secure session management with timeout handling
 */
export function useSecureSession() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const trackerRef = useRef<SessionActivityTracker | null>(null);
  const warningShownRef = useRef(false);

  const handleTimeout = useCallback(async () => {
    logSecurityEvent({
      type: 'auth_failure',
      message: 'Session timeout - user logged out',
      timestamp: Date.now(),
    });

    toast({
      variant: 'destructive',
      title: 'Session Expired',
      description: 'You have been logged out due to inactivity.',
    });

    await signOut();
  }, [signOut, toast]);

  const handleWarning = useCallback(() => {
    if (warningShownRef.current) return;
    warningShownRef.current = true;

    const minutesRemaining = Math.ceil(SESSION_CONFIG.WARNING_BEFORE_MS / 60000);
    
    toast({
      title: 'Session Expiring Soon',
      description: `Your session will expire in ${minutesRemaining} minutes. Click anywhere to stay logged in.`,
    });

    // Reset warning flag after timeout
    setTimeout(() => {
      warningShownRef.current = false;
    }, SESSION_CONFIG.WARNING_BEFORE_MS);
  }, [toast]);

  useEffect(() => {
    if (user) {
      // Start tracking when user is logged in
      trackerRef.current = new SessionActivityTracker();
      trackerRef.current.start(handleTimeout, handleWarning);

      return () => {
        trackerRef.current?.stop();
      };
    }
  }, [user, handleTimeout, handleWarning]);

  return {
    isAuthenticated: !!user,
    sessionTimeoutMs: SESSION_CONFIG.IDLE_TIMEOUT_MS,
  };
}
