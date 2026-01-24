import { useState, useEffect, useCallback, InputHTMLAttributes } from 'react';
import { isHoneypotFilled, isSubmissionTooFast } from '@/lib/validation';

interface UseFormSecurityOptions {
  honeypotFieldName?: string;
  minSubmitTime?: number; // seconds
}

interface FormSecurityState {
  formStartTime: number;
  honeypotValue: string;
  isBot: boolean;
}

/**
 * Hook for form security measures (honeypot, timing)
 */
export function useFormSecurity(options: UseFormSecurityOptions = {}) {
  const { honeypotFieldName = '_honey', minSubmitTime = 3 } = options;
  
  const [state, setState] = useState<FormSecurityState>({
    formStartTime: Date.now(),
    honeypotValue: '',
    isBot: false,
  });

  // Reset timer when component mounts
  useEffect(() => {
    setState(prev => ({ ...prev, formStartTime: Date.now() }));
  }, []);

  const setHoneypotValue = useCallback((value: string) => {
    setState(prev => ({
      ...prev,
      honeypotValue: value,
      isBot: isHoneypotFilled(value),
    }));
  }, []);

  const validateSubmission = useCallback((): { valid: boolean; reason?: string } => {
    // Check honeypot
    if (isHoneypotFilled(state.honeypotValue)) {
      console.warn('Form security: Honeypot field filled');
      return { valid: false, reason: 'honeypot' };
    }

    // Check timing
    if (isSubmissionTooFast(state.formStartTime, minSubmitTime)) {
      console.warn('Form security: Submission too fast');
      return { valid: false, reason: 'timing' };
    }

    return { valid: true };
  }, [state.honeypotValue, state.formStartTime, minSubmitTime]);

  // Hidden honeypot field props
  const honeypotProps: InputHTMLAttributes<HTMLInputElement> = {
    name: honeypotFieldName,
    type: 'text',
    value: state.honeypotValue,
    onChange: (e) => setHoneypotValue(e.target.value),
    autoComplete: 'off',
    tabIndex: -1,
    'aria-hidden': true,
    style: {
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    },
  };

  return {
    honeypotProps,
    validateSubmission,
    isBot: state.isBot,
    resetTimer: () => setState(prev => ({ ...prev, formStartTime: Date.now() })),
  };
}

/**
 * Honeypot field component (hidden from users, traps bots)
 */
export function HoneypotField({ 
  value, 
  onChange,
  name = '_honey' 
}: { 
  value: string; 
  onChange: (value: string) => void;
  name?: string;
}) {
  return (
    <div 
      style={{ 
        position: 'absolute', 
        left: '-9999px', 
        width: '1px', 
        height: '1px', 
        overflow: 'hidden' 
      }}
      aria-hidden="true"
    >
      <label htmlFor={name}>Leave this empty</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
}
