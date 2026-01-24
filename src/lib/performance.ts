import { useEffect } from 'react';

/**
 * PreloadLinks component
 * Adds preconnect and dns-prefetch hints for critical external resources
 * to improve page load performance
 */
export function PreloadLinks() {
  useEffect(() => {
    // Critical domains to preconnect
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    // Domains for dns-prefetch (less critical, but good to have)
    const dnsPrefetchDomains = [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ];

    // Add preconnect links
    preconnectDomains.forEach(domain => {
      const existingLink = document.querySelector(`link[href="${domain}"][rel="preconnect"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });

    // Add dns-prefetch links
    dnsPrefetchDomains.forEach(domain => {
      const existingLink = document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Cleanup function (optional - links can remain)
    return () => {};
  }, []);

  return null;
}

/**
 * Hook to preload critical images
 */
export function usePreloadImages(imageSrcs: string[]) {
  useEffect(() => {
    imageSrcs.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [imageSrcs]);
}

/**
 * Hook to defer non-critical scripts
 */
export function useDeferScript(src: string, options?: {
  async?: boolean;
  defer?: boolean;
  onLoad?: () => void;
}) {
  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = src;
    script.async = options?.async ?? true;
    script.defer = options?.defer ?? true;
    
    if (options?.onLoad) {
      script.onload = options.onLoad;
    }

    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount as it may be needed
    };
  }, [src, options]);
}

/**
 * Utility to check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Utility to check connection speed
 */
export function getConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  if (!connection) return 'unknown';
  
  const effectiveType = connection.effectiveType;
  
  if (effectiveType === '4g') return 'fast';
  if (effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-2g') return 'slow';
  
  return 'unknown';
}

/**
 * Hook to adapt content based on connection speed
 */
export function useAdaptiveLoading() {
  const connectionSpeed = getConnectionSpeed();
  const reducedMotion = prefersReducedMotion();

  return {
    connectionSpeed,
    reducedMotion,
    shouldLoadHighRes: connectionSpeed === 'fast',
    shouldAnimate: !reducedMotion,
    shouldPreload: connectionSpeed !== 'slow',
  };
}
