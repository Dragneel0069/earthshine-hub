import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics configuration - set your GA4 Measurement ID here when ready
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Check if user has consented to analytics cookies
const hasAnalyticsConsent = (): boolean => {
  const consent = localStorage.getItem('zerograph-cookie-consent');
  return consent === 'accepted';
};

// Initialize Google Analytics
const initializeGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  
  // Check if already loaded
  if ((window as any).gtag) return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll send page views manually for SPA
  });
};

// Track page view
const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;
  
  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// Track custom event
const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;
  
  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag('event', eventName, parameters);
};

// Predefined events for Zero Graph
export const AnalyticsEvents = {
  // Calculator events
  CALCULATOR_STARTED: 'calculator_started',
  CALCULATOR_COMPLETED: 'calculator_completed',
  EMISSIONS_CALCULATED: 'emissions_calculated',
  
  // Marketplace events
  CREDIT_VIEWED: 'credit_viewed',
  CREDIT_PURCHASE_INITIATED: 'credit_purchase_initiated',
  
  // Report events
  REPORT_GENERATED: 'report_generated',
  REPORT_DOWNLOADED: 'report_downloaded',
  
  // User events
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_COMPLETED: 'login_completed',
  
  // Engagement events
  CONSULTATION_REQUESTED: 'consultation_requested',
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  KNOWLEDGE_QUERY: 'knowledge_query',
  
  // Form events
  FORM_STARTED: 'form_started',
  FORM_FIELD_ERROR: 'form_field_error',
  FORM_SUBMITTED: 'form_submitted',
  FORM_ABANDONED: 'form_abandoned',
  
  // Navigation events
  CTA_CLICKED: 'cta_clicked',
  OUTBOUND_LINK: 'outbound_link',
  FILE_DOWNLOAD: 'file_download',
  
  // Error events
  ERROR_DISPLAYED: 'error_displayed',
  ERROR_BOUNDARY_TRIGGERED: 'error_boundary_triggered',
} as const;

// Custom hook for analytics
export function useAnalytics() {
  const location = useLocation();

  // Initialize analytics on mount (only if consent given)
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      initializeGA();
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      trackPageView(location.pathname);
    }
  }, [location.pathname]);

  // Memoized track function
  const track = useCallback((eventName: string, parameters?: Record<string, any>) => {
    trackEvent(eventName, parameters);
  }, []);

  return {
    track,
    trackPageView,
    events: AnalyticsEvents,
  };
}

// Export for direct usage
export { trackEvent, trackPageView, initializeGA };
