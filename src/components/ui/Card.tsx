import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

// Card variant types
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

// Card props interface
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// Card component
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      interactive = false,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = [
      'rounded-xl transition-all duration-200'
    ];

    // Variant classes
    const variantClasses = {
      default: ['bg-gray-900 border border-gray-800'],
      elevated: ['bg-gray-900 shadow-xl border border-gray-800'],
      outlined: ['bg-gray-900/50 backdrop-blur border border-gray-700'],
      glass: [
        'bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl'
      ]
    };

    // Interactive classes
    const interactiveClasses = interactive
      ? ['hover:shadow-2xl hover:border-purple-600/30 cursor-pointer hover:scale-[1.02]']
      : [];

    // Padding classes
    const paddingClasses = {
      none: [],
      sm: ['p-4'],
      md: ['p-6'],
      lg: ['p-8'],
      xl: ['p-10']
    };

    const classes = cn(
      ...baseClasses,
      ...variantClasses[variant],
      ...interactiveClasses,
      ...paddingClasses[padding],
      className
    );

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  title,
  description,
  action,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between space-y-0 pb-6',
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {title && (
          <h3 className="text-xl font-semibold text-white leading-none">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-gray-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center space-x-2">
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

// Card Title component
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={cn(
        'text-xl font-semibold text-white leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

// Card Description component
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cn(
        'text-sm text-gray-400 leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

// Card Content component
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Footer component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center pt-6 border-t border-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Media Card component (for project covers, user avatars, etc.)
interface MediaCardProps extends CardProps {
  image?: string;
  imageAlt?: string;
  overlay?: React.ReactNode;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  className,
  image,
  imageAlt,
  overlay,
  aspectRatio = 'video',
  children,
  ...props
}) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  };

  return (
    <Card
      className={cn('overflow-hidden p-0', className)}
      {...props}
    >
      <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio])}>
        {image && (
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        )}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            {overlay}
          </div>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </Card>
  );
};

export default Card;