import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: React.ReactNode;
  confirmText?: string;
  className?: ClassValue;
}

export function Modal({
  open,
  onClose,
  title,
  message,
  icon,
  confirmText = '确认',
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={twMerge(
            clsx(
              'w-full max-w-md',
              'bg-surface rounded-radius-xl shadow-5',
              'p-8 flex flex-col items-center text-center',
              className
            )
          )}
        >
          {/* Icon area */}
          <div className="w-14 h-14 rounded-radius-full bg-teal-50 flex items-center justify-center mb-6">
            {icon || <CheckCircle className="w-7 h-7 text-teal-500" />}
          </div>
          
          {/* Title */}
          <h3 className="font-heading font-semibold text-h3 text-foreground mb-2">
            {title}
          </h3>
          
          {/* Message */}
          <p className="font-body text-body text-muted-foreground mb-8">
            {message}
          </p>
          
          {/* Action */}
          <button
            className="inline-flex items-center justify-center font-body font-medium bg-teal-500 text-white hover:brightness-97 active:brightness-95 transition-older cursor-pointer h-11 px-6 rounded-radius-md text-body"
            onClick={onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}