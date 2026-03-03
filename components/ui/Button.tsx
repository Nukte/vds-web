'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-foreground border border-accent hover:opacity-90',
  secondary:
    'bg-card text-foreground border border-border hover:bg-muted',
  ghost:
    'bg-transparent text-foreground border border-transparent hover:bg-muted',
  destructive:
    'bg-destructive text-destructive-foreground border border-destructive hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
};

/**
 * Base Button component.
 *
 * Rules (agent.md §5):
 * - No rounded-full (reserved for icon buttons)
 * - Semantic: renders a <button> element
 * - isLoading shows an inline spinner and disables the button
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={[
          'inline-flex items-center justify-center',
          'font-sans font-medium tracking-tight',
          'rounded-md',
          'transition-colors duration-150',
          'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {isLoading && (
          <span
            aria-hidden="true"
            className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
