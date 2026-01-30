import { useEffect, useState } from 'react';

interface PreloadOptions {
  priority?: 'high' | 'low' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Hook to preload images for better LCP performance
 */
export function useImagePreload(src: string, options: PreloadOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    // Set fetchpriority for modern browsers
    if (options.priority) {
      (img as any).fetchPriority = options.priority;
    }

    img.onload = () => {
      setIsLoaded(true);
      options.onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      options.onError?.();
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, options.priority]);

  return { isLoaded, hasError };
}

/**
 * Hook to preload multiple images in parallel
 */
export function useImagesPreload(sources: string[]) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!sources.length) return;

    const images: HTMLImageElement[] = [];

    sources.forEach((src) => {
      const img = new Image();
      
      img.onload = () => {
        setLoadedCount((prev) => prev + 1);
      };

      img.onerror = () => {
        setErrors((prev) => [...prev, src]);
      };

      img.src = src;
      images.push(img);
    });

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [sources.join(',')]);

  return {
    loadedCount,
    totalCount: sources.length,
    isComplete: loadedCount === sources.length,
    errors,
  };
}

/**
 * Preload critical images on app initialization
 */
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof window === 'undefined') return;

  imagePaths.forEach((path) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  });
}
