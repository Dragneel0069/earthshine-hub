'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ScrollExpandMediaProps {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  src,
  poster,
  background,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  children,
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    setIsVideo(videoExtensions.some(ext => src.toLowerCase().includes(ext)));
  }, [src]);

  useEffect(() => {
    const handleReset = () => {
      if (containerRef.current) {
        window.scrollTo(0, 0);
        setIsComplete(false);
      }
    };

    window.addEventListener('resetSection', handleReset);
    return () => window.removeEventListener('resetSection', handleReset);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Track when animation is complete
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsComplete(latest >= 0.95);
  });

  // Media container transforms
  const mediaScale = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const mediaRadius = useTransform(scrollYProgress, [0, 0.3], [24, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 0.3], ['10%', '0%']);

  // Text transforms
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // Overlay transforms
  const overlayOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 0.6]);

  // Content transforms
  const contentOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.35, 0.5], [100, 0]);

  // Fade out the entire fixed section
  const sectionOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      {/* Fixed container that fades out */}
      <motion.div 
        className="fixed inset-0 z-10"
        style={{ 
          opacity: sectionOpacity,
          pointerEvents: isComplete ? 'none' : 'auto'
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Fixed container for media */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {/* Title overlay */}
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <span className="text-white/60 text-sm uppercase tracking-widest mb-2">
              {date}
            </span>
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold font-display text-center px-4 ${
                textBlend ? 'text-white mix-blend-difference' : 'text-white drop-shadow-2xl'
              }`}
            >
              {title}
            </h1>
            <p className="text-white/60 text-sm mt-4 animate-pulse">
              {scrollToExpand}
            </p>
          </motion.div>

          {/* Media container */}
          <motion.div
            className="relative w-full h-full overflow-hidden"
            style={{
              scale: mediaScale,
              borderRadius: mediaRadius,
              y: mediaY,
            }}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setIsLoaded(true)}
                className="w-full h-full object-cover"
                style={{
                  filter: 'saturate(1.1) contrast(1.05)',
                }}
              />
            ) : (
              <img
                src={src}
                alt={title}
                onLoad={() => setIsLoaded(true)}
                className="w-full h-full object-cover"
                style={{
                  filter: 'saturate(1.1) contrast(1.05)',
                }}
              />
            )}

            {/* Cinematic vignette overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.6) 100%)',
              }}
            />

            {/* Color grading overlay - subtle teal/green tint */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 50%, rgba(20, 184, 166, 0.1) 100%)',
              }}
            />

            {/* Top gradient for navbar readability */}
            <div 
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
              }}
            />

            {/* Bottom gradient for text readability */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
              }}
            />

            {/* Dark overlay for content readability */}
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none"
              style={{ opacity: overlayOpacity }}
            />
          </motion.div>

          {/* Content overlay */}
          {children && (
            <motion.div
              className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
              style={{ opacity: contentOpacity, y: contentY }}
            >
              <div className="pointer-events-auto max-w-4xl mx-auto px-6">
                {children}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollExpandMedia;
