'use client';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>}
      <input
        className={cn(
          'w-full px-3 py-2 text-sm border rounded-lg bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]',
          error ? 'border-[#dc2626]' : 'border-[#E5E7EB]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#dc2626] mt-1">{error}</p>}
    </div>
  );
}
