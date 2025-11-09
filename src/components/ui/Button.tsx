import React from 'react';
import { motion } from 'framer-motion';
import { ButtonProps } from '@/types';
import { cn } from '@/utils/helpers';

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 focus:ring-primary-500 shadow-lg',
    secondary: 'glass-button text-text-primary hover:bg-surface-light focus:ring-primary-500',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-medium focus:ring-primary-500',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-lg',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm gap-2',
    medium: 'px-4 py-2 text-sm gap-2',
    large: 'px-6 py-3 text-base gap-3',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  return (
    <motion.button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {icon && !loading && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {icon}
        </span>
      )}

      <span className={loading ? 'opacity-50' : ''}>
        {children}
      </span>
    </motion.button>
  );
};