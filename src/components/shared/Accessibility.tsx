import { ReactNode, useState, useEffect, useRef } from 'react';

interface AccessibleAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

/**
 * Screen reader announcer component
 * Uses ARIA live regions to announce messages to screen readers
 */
export function AccessibleAnnouncer({ 
  message, 
  politeness = 'polite' 
}: AccessibleAnnouncerProps) {
  const [announced, setAnnounced] = useState('');

  useEffect(() => {
    if (message) {
      setAnnounced('');
      // Small delay to ensure screen reader picks up the change
      const timer = setTimeout(() => setAnnounced(message), 100);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announced}
    </div>
  );
}

/**
 * Skip link for keyboard navigation
 * Already implemented in index.css, this is a reusable component version
 */
export function SkipLink({ 
  targetId = 'main-content', 
  children = 'Skip to main content' 
}: { 
  targetId?: string; 
  children?: ReactNode;
}) {
  return (
    <a 
      href={`#${targetId}`} 
      className="skip-to-content"
    >
      {children}
    </a>
  );
}

/**
 * Focus trap for modals and dialogs
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus when trap is deactivated
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook to manage reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Visually hidden span for screen readers only
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

/**
 * Component to ensure proper heading hierarchy
 */
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Heading({ level, children, className, id }: HeadingProps) {
  const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  switch (Component) {
    case 'h1':
      return <h1 className={className} id={id}>{children}</h1>;
    case 'h2':
      return <h2 className={className} id={id}>{children}</h2>;
    case 'h3':
      return <h3 className={className} id={id}>{children}</h3>;
    case 'h4':
      return <h4 className={className} id={id}>{children}</h4>;
    case 'h5':
      return <h5 className={className} id={id}>{children}</h5>;
    case 'h6':
      return <h6 className={className} id={id}>{children}</h6>;
    default:
      return <h2 className={className} id={id}>{children}</h2>;
  }
}
