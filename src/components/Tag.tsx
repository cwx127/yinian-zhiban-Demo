import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TagProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'default' | 'sm';
  children: React.ReactNode;
  className?: ClassValue;
}

const variantStyles = {
  default: 'bg-neutral-100 text-neutral-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
};

const sizeStyles = {
  default: 'px-3 py-1 text-caption',
  sm: 'px-2 py-0.5 text-eyebrow',
};

export function Tag({
  variant = 'default',
  size = 'default',
  children,
  className,
}: TagProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-radius-full font-body font-medium',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
}