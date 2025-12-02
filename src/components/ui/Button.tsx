import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Button props interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Button component
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    ];

    // Variant classes
    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500 shadow-lg hover:shadow-xl'
      ],
      secondary: [
        'bg-gray-800 text-gray-100 hover:bg-gray-700 focus:ring-gray-500 border border-gray-700'
      ],
      ghost: [
        'text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-500'
      ],
      outline: [
        'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500 bg-transparent'
      ],
      link: [
        'text-purple-600 hover:text-purple-700 focus:ring-purple-500 p-0 h-auto font-normal underline-offset-4 hover:underline'
      ]
    };

    // Size classes
    const sizeClasses = {
      xs: ['px-3 py-1.5 text-xs'],
      sm: ['px-4 py-2 text-sm'],
      md: ['px-6 py-2.5 text-base'],
      lg: ['px-8 py-3 text-lg'],
      xl: ['px-10 py-4 text-xl']
    };

    const classes = cn(
      ...baseClasses,
      ...variantClasses[variant],
      ...sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        
        {children}
        
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;