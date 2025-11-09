import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search } from 'lucide-react';
import { InputProps } from '@/types';
import { cn } from '@/utils/helpers';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      value,
      placeholder,
      disabled = false,
      error,
      label,
      icon,
      onChange,
      onKeyDown,
      onSubmit,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const isSearch = type === 'search';

    const inputType = isPassword && showPassword ? 'text' : type;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && onSubmit) {
        onSubmit();
      }
      onKeyDown?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {isSearch ? <Search className="w-4 h-4" /> : icon}
            </div>
          )}

          <motion.input
            ref={ref}
            type={inputType}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              // Base styles
              'w-full px-3 py-2 rounded-lg border transition-all duration-200',
              'bg-surface-medium backdrop-blur-md',
              'text-text-primary placeholder-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Icon padding
              icon && 'pl-10',
              isPassword && 'pr-10',

              // Focus state
              isFocused && 'bg-surface-light',

              // Error state
              error && 'border-error focus:ring-error',

              className
            )}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-error"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';