'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="material-symbols-outlined text-4xl text-[#D1D5DB] mb-3">{icon}</span>
      <h3 className="text-sm font-medium text-[#111827] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#6B7280] mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
