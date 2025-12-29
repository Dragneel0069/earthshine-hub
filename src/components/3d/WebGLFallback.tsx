import { motion } from "framer-motion";

interface WebGLFallbackProps {
  className?: string;
  variant?: "globe" | "molecule" | "dashboard";
}

export function WebGLFallback({ className = "", variant = "globe" }: WebGLFallbackProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-full" />
      
      {variant === "globe" && (
        <motion.div
          className="relative w-48 h-48 md:w-64 md:h-64"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
          <div className="absolute inset-4 rounded-full border border-primary/20" />
          <div className="absolute inset-8 rounded-full border border-primary/10" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          
          {/* Orbit rings */}
          <div className="absolute inset-[-20%] rounded-full border border-primary/20 rotate-12" />
          <div className="absolute inset-[-10%] rounded-full border border-primary/15 -rotate-12" />
          
          {/* Glowing dots */}
          <motion.div
            className="absolute w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
            style={{ top: "10%", left: "50%" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-accent rounded-full shadow-lg shadow-accent/50"
            style={{ bottom: "20%", right: "20%" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
      )}

      {variant === "molecule" && (
        <motion.div
          className="relative w-32 h-32"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          {/* Central atom */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-lg shadow-primary/50" />
          
          {/* Orbital electrons */}
          <motion.div
            className="absolute w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ top: "10%", left: "50%", transformOrigin: "0 150%" }}
          />
          <motion.div
            className="absolute w-3 h-3 bg-primary/70 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ bottom: "20%", right: "20%", transformOrigin: "-100% -50%" }}
          />
        </motion.div>
      )}

      {variant === "dashboard" && (
        <div className="flex items-end gap-2 h-32">
          {[0.6, 0.8, 0.5, 0.9, 0.7].map((height, i) => (
            <motion.div
              key={i}
              className="w-6 bg-gradient-to-t from-primary to-primary/50 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${height * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl !== null;
  } catch (e) {
    return false;
  }
}
