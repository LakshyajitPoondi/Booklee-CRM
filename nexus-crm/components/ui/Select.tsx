'use client';

import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export default function Select({ label, error, className, children, ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>}
      <select
        className={cn(
          'w-full px-3 py-2 text-sm border rounded-lg bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]',
          error ? 'border-[#dc2626]' : 'border-[#E5E7EB]',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}
