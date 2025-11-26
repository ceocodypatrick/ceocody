import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../utils/helpers';

// Input variant types
export type InputVariant = 'default' | 'filled' | 'outlined' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';

// Input props interface
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Input component
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    // Base classes
    const baseClasses = [
      'flex items-center transition-all duration-200 rounded-lg border',
      'placeholder-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ];

    // Variant classes
    const variantClasses = {
      default: [
        'bg-gray-800 border-gray-700',
        'focus:border-purple-500 focus:ring-purple-500',
        'text-white'
      ],
      filled: [
        'bg-gray-800/50 border-transparent',
        'focus:border-purple-500 focus:ring-purple-500',
        'text-white focus:bg-gray-800'
      ],
      outlined: [
        'bg-transparent border-gray-700',
        'focus:border-purple-500 focus:ring-purple-500',
        'text-white'
      ],
      ghost: [
        'bg-transparent border-transparent',
        'focus:border-purple-500 focus:ring-purple-500',
        'text-white focus:bg-gray-800/50'
      ]
    };

    // Size classes
    const sizeClasses = {
      sm: ['px-3 py-2 text-sm'],
      md: ['px-4 py-2.5 text-base'],
      lg: ['px-5 py-3 text-lg']
    };

    // Error classes
    const errorClasses = error
      ? ['border-red-500 focus:ring-red-500 text-red-50']
      : [];

    // Width classes
    const widthClasses = fullWidth ? ['w-full'] : [];

    // Container classes
    const containerClasses = cn(
      'relative',
      fullWidth && 'w-full'
    );

    // Input classes
    const inputClasses = cn(
      ...baseClasses,
      ...variantClasses[variant],
      ...sizeClasses[size],
      ...errorClasses,
      ...widthClasses,
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    );

    // Icon container classes
    const iconContainerClasses = cn(
      'absolute inset-y-0 flex items-center text-gray-400 pointer-events-none'
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(iconContainerClasses, 'left-0 pl-3')}>
              {leftIcon}
            </div>
          )}
          
          <input
            className={inputClasses}
            ref={ref}
            disabled={disabled}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {rightIcon && (
            <div className={cn(iconContainerClasses, 'right-0 pr-3')}>
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      resize = 'vertical',
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'flex items-center justify-between w-full px-4 py-3 text-sm',
      'bg-gray-800 border border-gray-700 rounded-lg',
      'placeholder-gray-500 text-white',
      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500',
      ''disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-red-500 focus:ring-red-500 text-red-50',
      fullWidth && 'w-full',
      resize !== 'both' && resize !== 'horizontal' && resize !== 'vertical' && 'resize-none',
      resize === 'none' && 'resize-none',
      resize === 'horizontal' && 'resize-x',
      resize === 'vertical' && 'resize-y',
      className
    );

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <textarea
          className={classes}
          ref={ref}
          {...props}
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'flex items-center w-full px-4 py-2.5 text-base',
      'bg-gray-800 border border-gray-700 rounded-lg',
      'text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500',
      ''disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-red-500 focus:ring-red-500 text-red-50',
      fullWidth && 'w-full',
      className
    );

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <select
          className={classes}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      ...props
    },
    ref
  ) => {
    const checkboxClasses = cn(
      'h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-600',
      'focus:ring-2 focus:ring-purple-500 focus:ring-offset-gray-900',
      ''disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-red-500 focus:ring-red-500',
      className
    );

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className={checkboxClasses}
            ref={ref}
            {...props}
          />
        </div>
        
        <div className="ml-3 text-sm">
          {label && (
            <label className="font-medium text-gray-300">
              {label}
            </label>
          )}
          
          {error && (
            <p className="mt-1 text-sm text-red-400">
              {error}
            </p>
          )}
          
          {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Input;