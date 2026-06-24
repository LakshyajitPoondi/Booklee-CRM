'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm',
        variant === 'primary' && 'bg-[#111827] text-white hover:bg-[#1f2937]',
        variant === 'secondary' && 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB]',
        variant === 'ghost' && 'text-[#6B7280] hover:bg-[#F5F6F8] hover:text-[#111827]',
        variant === 'danger' && 'bg-[#dc2626] text-white hover:bg-[#b91c1c]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
