import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  src: string;
  alt: string;
  /** Base64 blur placeholder or low-quality image URL */
  blurDataURL?: string;
  /** Priority loading for LCP images */
  priority?: boolean;
  /** Aspect ratio to prevent layout shift (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Fill container instead of using aspect ratio */
  fill?: boolean;
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Container class */
  containerClassName?: string;
  /** Callback when image loads */
  onLoadComplete?: () => void;
}

// Default blur placeholder - tiny gray SVG
const DEFAULT_BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';

// Generate a color-based blur placeholder
export function generateBlurPlaceholder(color: string = '#e5e7eb'): string {
  const svg = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * OptimizedImage - Performance-focused image component
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur-up placeholder effect for smooth loading
 * - Priority loading for LCP images
 * - Aspect ratio preservation to prevent CLS
 * - Native loading="lazy" and decoding="async" support
 */
export function OptimizedImage({
  src,
  alt,
  blurDataURL = DEFAULT_BLUR,
  priority = false,
  aspectRatio,
  fill = false,
  objectFit = 'cover',
  containerClassName,
  className,
  onLoadComplete,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip intersection observer for priority images
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  const containerStyles = fill
    ? { position: 'relative' as const, width: '100%', height: '100%' }
    : aspectRatio
    ? { aspectRatio }
    : {};

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        containerClassName
      )}
      style={containerStyles}
    >
      {/* Blur placeholder - always visible initially */}
      <img
        src={blurDataURL}
        alt=""
        aria-hidden="true"
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity duration-500',
          isLoaded ? 'opacity-0' : 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
        )}
        style={{
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Shimmer effect while loading */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(var(--muted-foreground) / 0.1) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}

      {/* Actual image - only render when in view */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            fill && 'absolute inset-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}

export default OptimizedImage;
