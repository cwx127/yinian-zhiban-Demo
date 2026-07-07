import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  className?: ClassValue;
  onClick?: () => void;
}

const variantStyles = {
  primary: 'bg-teal-500 text-white hover:brightness-97 active:brightness-95',
  secondary: 'bg-warm-500 text-white hover:brightness-97 active:brightness-95',
  outline: 'bg-transparent border-1.5 border-teal-500 text-teal-500 hover:bg-teal-50 active:bg-teal-100',
  ghost: 'bg-transparent text-teal-600 hover:bg-teal-50 active:bg-teal-100',
};

const sizeStyles = {
  sm: 'h-9 px-3 rounded-radius-sm text-caption',
  md: 'h-11 px-4 rounded-radius-md text-body',
  lg: 'h-13 px-6 rounded-radius-lg text-body',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-body font-medium',
          'transition-older cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}