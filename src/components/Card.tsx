import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  icon?: LucideIcon;
  iconColor?: string;
  title?: string;
  desc?: string;
  tag?: React.ReactNode;
  children?: React.ReactNode;
  className?: ClassValue;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-surface border border-border shadow-1 hover:shadow-2',
  elevated: 'bg-surface shadow-2 hover:shadow-3',
  outlined: 'bg-surface border-1.5 border-border',
};

export function Card({
  variant = 'default',
  icon,
  iconColor = 'text-teal-500',
  title,
  desc,
  tag,
  children,
  className,
  onClick,
}: CardProps) {
  const IconComponent = icon;

  return (
    <div
      className={twMerge(
        clsx(
          'p-8 rounded-radius-xl',
          'transition-older',
          variantStyles[variant],
          onClick && 'cursor-pointer hover:brightness-98',
          className
        )
      )}
      onClick={onClick}
    >
      {IconComponent && (title || tag) && (
        <div className="flex items-center gap-3 mb-3">
          <IconComponent className={twMerge(clsx('w-6 h-6', iconColor))} />
          {title && (
            <span className="font-heading font-semibold text-h4 text-foreground truncate flex-1">
              {title}
            </span>
          )}
          {tag && <div className="ml-auto">{tag}</div>}
        </div>
      )}
      {desc && (
        <p className="font-body text-body text-muted-foreground mb-0">
          {desc}
        </p>
      )}
      {children}
    </div>
  );
}