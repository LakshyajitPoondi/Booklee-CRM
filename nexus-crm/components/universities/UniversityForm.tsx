'use client';

import { useState } from 'react';
import type { University } from '@/types';
import { COUNTRIES, INTAKES } from '@/lib/constants';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface UniversityFormProps {
  initial?: Partial<University>;
  onSubmit: (data: Omit<University, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function UniversityForm({ initial, onSubmit, onCancel }: UniversityFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [country, setCountry] = useState(initial?.country ?? 'United Kingdom');
  const [city, setCity] = useState(initial?.city ?? '');
  const [intake, setIntake] = useState(initial?.intake?.[0] ?? INTAKES[0]);
  const [acceptanceRate, setAcceptanceRate] = useState(String(initial?.acceptanceRate ?? 0));
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? '');
  const [website, setWebsite] = useState(initial?.website ?? '');
  const [partnerSince, setPartnerSince] = useState(initial?.partnerSince ?? new Date().getFullYear().toString());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'University name is required';
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) e.contactEmail = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      country,
      city: city.trim(),
      intake: [intake],
      acceptanceRate: parseFloat(acceptanceRate) || 0,
      activeApplications: initial?.activeApplications ?? 0,
      partnerSince,
      contactEmail: contactEmail.trim(),
      website: website.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="University name *" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Intake" value={intake} onChange={(e) => setIntake(e.target.value)}>
          {INTAKES.map((i) => <option key={i} value={i}>{i}</option>)}
        </Select>
        <Input label="Acceptance rate (%)" type="number" value={acceptanceRate} onChange={(e) => setAcceptanceRate(e.target.value)} min="0" max="100" />
      </div>
      <Input label="Contact email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} error={errors.contactEmail} />
      <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
      <Input label="Partner since" value={partnerSince} onChange={(e) => setPartnerSince(e.target.value)} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial?.id ? 'Save changes' : 'Add university'}</Button>
      </div>
    </form>
  );
}
