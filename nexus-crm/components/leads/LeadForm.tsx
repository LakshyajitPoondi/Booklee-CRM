'use client';

import { useState } from 'react';
import type { Lead, LeadStatus } from '@/types';
import { LEAD_STATUS_LABELS, LEAD_GROUPS, COUNTRIES } from '@/lib/constants';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface LeadFormProps {
  initial?: Partial<Lead>;
  onSubmit: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function LeadForm({ initial, onSubmit, onCancel }: LeadFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [status, setStatus] = useState<LeadStatus>(initial?.status ?? 'new_lead');
  const [source, setSource] = useState(initial?.source ?? '');
  const [country, setCountry] = useState(initial?.country ?? '');
  const [value, setValue] = useState(String(initial?.value ?? 0));
  const [group, setGroup] = useState(initial?.group ?? LEAD_GROUPS[0]);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [followUpDate, setFollowUpDate] = useState(initial?.followUpDate?.split('T')[0] ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address';
    if (!country) e.country = 'Country is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      source: source.trim(),
      country,
      value: parseFloat(value) || 0,
      counselorId: initial?.counselorId ?? '',
      group,
      notes: notes.trim(),
      followUpDate: followUpDate ? new Date(followUpDate).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full name *" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
          {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
        <Select label="Group" value={group} onChange={(e) => setGroup(e.target.value)}>
          {LEAD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Country *" value={country} onChange={(e) => setCountry(e.target.value)} error={errors.country}>
          <option value="">Select country</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input label="Value (£)" type="number" value={value} onChange={(e) => setValue(e.target.value)} min="0" />
      </div>
      <Input label="Source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Website, Referral" />
      <Input label="Follow-up date" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
      <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial?.id ? 'Save changes' : 'Create lead'}</Button>
      </div>
    </form>
  );
}
