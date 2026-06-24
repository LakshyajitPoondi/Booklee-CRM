'use client';

import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>}
      <textarea
        className={cn(
          'w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] resize-y min-h-[80px]',
          className
        )}
        {...props}
      />
    </div>
  );
}
