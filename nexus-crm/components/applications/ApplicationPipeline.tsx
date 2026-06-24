'use client';

import { useState } from 'react';
import type { Application, ApplicationStatus } from '@/types';
import { APPLICATION_STAGES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface ApplicationPipelineProps {
  applications: Application[];
  getUniversityName: (id: string) => string;
  onMove: (id: string, status: ApplicationStatus) => void;
  onEdit: (app: Application) => void;
}

export default function ApplicationPipeline({
  applications,
  getUniversityName,
  onMove,
  onEdit,
}: ApplicationPipelineProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {APPLICATION_STAGES.map((stage) => {
        const stageApps = applications.filter((a) => a.status === stage.key);
        return (
          <div
            key={stage.key}
            className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-3 min-h-[280px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedId) {
                onMove(draggedId, stage.key);
                setDraggedId(null);
              }
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: stage.color }} />
              <h3 className="text-xs font-semibold text-[#111827]">{stage.label}</h3>
              <span className="ml-auto text-xs text-[#6B7280]">{stageApps.length}</span>
            </div>
            <div className="space-y-2">
              {stageApps.map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={() => setDraggedId(app.id)}
                  onDragEnd={() => setDraggedId(null)}
                  onClick={() => onEdit(app)}
                  className="bg-white rounded-lg border border-[#E5E7EB] p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow"
                >
                  <p className="text-sm font-medium text-[#111827]">{app.studentName}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 truncate">{getUniversityName(app.universityId)}</p>
                  <p className="text-xs text-[#374151] mt-1">{app.course}</p>
                  <p className="text-xs text-[#6B7280] mt-1">{formatCurrency(app.fee)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
