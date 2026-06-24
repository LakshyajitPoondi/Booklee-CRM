'use client';

import { useState } from 'react';
import { useCrm } from '@/context/CrmContext';
import type { SupportTicket } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { cn, formatShortDate } from '@/lib/utils';

const STATUS_COLORS: Record<SupportTicket['status'], { bg: string; text: string }> = {
  open: { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]' },
  in_progress: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  resolved: { bg: 'bg-[#d1fae5]', text: 'text-[#065f46]' },
  closed: { bg: 'bg-[#F3F4F6]', text: 'text-[#374151]' },
};

const STATUS_LABELS: Record<SupportTicket['status'], string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const PRIORITY_COLORS: Record<SupportTicket['priority'], { bg: string; text: string }> = {
  low: { bg: 'bg-[#F3F4F6]', text: 'text-[#374151]' },
  medium: { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]' },
  high: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  urgent: { bg: 'bg-[#fecaca]', text: 'text-[#991b1b]' },
};

export default function SupportTicketsTab() {
  const { data, addTicket, updateTicket, addTicketResponse } = useCrm();
  const { supportTickets } = data.settings;

  const [createOpen, setCreateOpen] = useState(false);
  const [detailTicket, setDetailTicket] = useState<SupportTicket | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [responseText, setResponseText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = () => {
    const e: Record<string, string> = {};
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!description.trim()) e.description = 'Description is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    addTicket({ subject: subject.trim(), description: description.trim(), priority });
    setCreateOpen(false);
    setSubject('');
    setDescription('');
    setPriority('medium');
    setErrors({});
  };

  const handleAddResponse = () => {
    if (!responseText.trim() || !detailTicket) return;
    addTicketResponse(detailTicket.id, responseText.trim());
    setResponseText('');
    // Update local reference
    const updated = data.settings.supportTickets.find((t) => t.id === detailTicket.id);
    if (updated) setDetailTicket({ ...updated });
  };

  // Sync detailTicket with latest data
  const currentTicket = detailTicket
    ? supportTickets.find((t) => t.id === detailTicket.id) ?? detailTicket
    : null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-[#111827]">Support Tickets</h3>
            <p className="text-sm text-[#6B7280] mt-0.5">{supportTickets.length} ticket{supportTickets.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <span className="material-symbols-outlined text-lg">add</span>
            New Ticket
          </Button>
        </div>

        {supportTickets.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-8">No support tickets yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB]">
                  <th className="pb-3 pr-4 font-medium">Subject</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Priority</th>
                  <th className="pb-3 pr-4 font-medium">Created</th>
                  <th className="pb-3 font-medium">Responses</th>
                </tr>
              </thead>
              <tbody>
                {supportTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] cursor-pointer"
                    onClick={() => setDetailTicket(ticket)}
                  >
                    <td className="py-3 pr-4 font-medium text-[#111827]">{ticket.subject}</td>
                    <td className="py-3 pr-4">
                      <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-medium', STATUS_COLORS[ticket.status].bg, STATUS_COLORS[ticket.status].text)}>
                        {STATUS_LABELS[ticket.status]}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize', PRIORITY_COLORS[ticket.priority].bg, PRIORITY_COLORS[ticket.priority].text)}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[#6B7280]">{formatShortDate(ticket.createdAt)}</td>
                    <td className="py-3 text-[#6B7280]">{ticket.responses.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); setErrors({}); }} title="New Support Ticket" maxWidth="max-w-lg">
        <div className="space-y-4">
          <Input label="Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} error={errors.subject} />
          <Textarea label="Description *" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          {errors.description && <p className="text-xs text-[#dc2626]">{errors.description}</p>}
          <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setCreateOpen(false); setErrors({}); }}>Cancel</Button>
            <Button onClick={handleCreate}>Create Ticket</Button>
          </div>
        </div>
      </Modal>

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={!!currentTicket}
        onClose={() => setDetailTicket(null)}
        title={currentTicket?.subject ?? 'Ticket'}
        maxWidth="max-w-2xl"
      >
        {currentTicket && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-medium', STATUS_COLORS[currentTicket.status].bg, STATUS_COLORS[currentTicket.status].text)}>
                {STATUS_LABELS[currentTicket.status]}
              </span>
              <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize', PRIORITY_COLORS[currentTicket.priority].bg, PRIORITY_COLORS[currentTicket.priority].text)}>
                {currentTicket.priority}
              </span>
              <span className="text-xs text-[#6B7280] ml-auto">Created {formatShortDate(currentTicket.createdAt)}</span>
            </div>

            <p className="text-sm text-[#374151]">{currentTicket.description}</p>

            <div className="flex items-center gap-3">
              <Select
                label="Update Status"
                value={currentTicket.status}
                onChange={(e) => {
                  const newStatus = e.target.value as SupportTicket['status'];
                  updateTicket(currentTicket.id, { status: newStatus });
                  setDetailTicket({ ...currentTicket, status: newStatus });
                }}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </Select>
            </div>

            {/* Responses */}
            <div>
              <h4 className="text-sm font-semibold text-[#111827] mb-3">Responses ({currentTicket.responses.length})</h4>
              {currentTicket.responses.length === 0 ? (
                <p className="text-sm text-[#6B7280]">No responses yet.</p>
              ) : (
                <div className="space-y-3">
                  {currentTicket.responses.map((resp) => (
                    <div key={resp.id} className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[#111827]">{resp.author}</span>
                        <span className="text-xs text-[#6B7280]">{formatShortDate(resp.createdAt)}</span>
                      </div>
                      <p className="text-sm text-[#374151]">{resp.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add response */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type a response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddResponse(); }}
                className="flex-1 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
              />
              <Button onClick={handleAddResponse} disabled={!responseText.trim()}>Send</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
