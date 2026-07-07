import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from 'lucide-react';

interface NavigationProps {
  currentPage: 'dashboard' | 'health' | 'settings';
  onNavigate: (page: 'dashboard' | 'health' | 'settings') => void;
  className?: ClassValue;
}

const navItems = [
  { key: 'dashboard', label: '首页' },
  { key: 'health', label: '健康' },
  { key: 'settings', label: '我的' },
];

export function Navigation({
  currentPage,
  onNavigate,
  className,
}: NavigationProps) {
  return (
    <nav
      className={twMerge(
        clsx(
          'w-full bg-surface',
          'flex items-center justify-between',
          'h-16 px-6',
          'border-b border-border',
          className
        )
      )}
    >
      {/* Logo */}
      <span className="font-heading font-semibold text-h4 text-teal-500">
        颐年智伴
      </span>
      
      {/* Links */}
      <div className="flex items-center gap-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key as typeof currentPage)}
            className={twMerge(
              clsx(
                'font-body font-medium text-body px-4 py-2',
                'transition-older cursor-pointer',
                'border-b-2 border-transparent',
                currentPage === item.key
                  ? 'text-teal-500 border-teal-500'
                  : 'text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              )
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      
      {/* Avatar */}
      <div className="w-9 h-9 rounded-radius-full bg-teal-500 flex items-center justify-center">
        <User className="w-4.5 h-4.5 text-white" />
      </div>
    </nav>
  );
}