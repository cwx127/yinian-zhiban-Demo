import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

interface InputProps {
  label: string;
  error?: boolean;
  errorText?: string;
  helperText?: string;
  className?: ClassValue;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({
    label,
    error = false,
    errorText,
    helperText,
    className,
    value,
    onChange,
    placeholder,
    type = 'text',
    readOnly = false,
  }, ref) {
    return (
      <div className={twMerge(clsx('flex flex-col gap-1', className))}>
        <label className="font-body font-medium text-body text-foreground">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={twMerge(
            clsx(
              'h-12 px-4 rounded-radius-lg font-body text-body',
              'border-1.5 bg-surface',
              'transition-older',
              'focus:border-teal-500 focus:ring-3 focus:ring-teal-500/15',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/15'
                : 'border-border',
              readOnly ? 'bg-surface-container cursor-default' : 'bg-surface'
            )
          )}
        />
        {error && errorText && (
          <span className="font-body text-caption text-error-500">{errorText}</span>
        )}
        {!error && helperText && (
          <span className="font-body text-caption text-muted-foreground">{helperText}</span>
        )}
      </div>
    );
  }
);