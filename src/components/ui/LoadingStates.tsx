import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSpinner: React.FC<{
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ size = 'medium', className }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <motion.div
      className={sizeClasses[size]}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <Loader2 className={`w-full h-full text-primary-500 ${className}`} />
    </motion.div>
  );
};

export const LoadingDots: React.FC<{
  className?: string;
}> = ({ className }) => (
  <div className={`loading-dots ${className}`}>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export const PulseLoader: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 3, className }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-primary-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

export const SkeletonLoader: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}> = ({ width = '100%', height = '1rem', className, rounded = false }) => (
  <motion.div
    className={cn(
      'bg-surface-medium',
      rounded ? 'rounded-full' : 'rounded',
      className
    )}
    style={{ width, height }}
    animate={{
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
    }}
  />
);

export const AIThinkingLoader: React.FC<{
  className?: string;
}> = ({ className }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <Sparkles className="w-5 h-5 text-primary-500" />
    </motion.div>
    <div className="flex gap-1">
      <PulseLoader count={3} />
    </div>
  </div>
);

export const PageLoader: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = 'Loading...', className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}
  >
    <LoadingSpinner size="large" />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-text-secondary text-center"
    >
      {message}
    </motion.p>
  </motion.div>
);

export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  showLabel?: boolean;
}> = ({ progress, className, showLabel = false }) => (
  <div className={`w-full ${className}`}>
    {showLabel && (
      <div className="flex justify-between text-sm text-text-secondary mb-2">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
    )}
    <div className="w-full bg-surface-medium rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// Helper function for className concatenation
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};