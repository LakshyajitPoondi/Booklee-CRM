'use client';

import { useState } from 'react';
import type { Application, ApplicationStatus } from '@/types';
import { APPLICATION_STAGES, INTAKES } from '@/lib/constants';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useCrm } from '@/context/CrmContext';

interface ApplicationFormProps {
  initial?: Partial<Application>;
  onSubmit: (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function ApplicationForm({ initial, onSubmit, onCancel }: ApplicationFormProps) {
  const { data } = useCrm();
  const [studentName, setStudentName] = useState(initial?.studentName ?? '');
  const [studentEmail, setStudentEmail] = useState(initial?.studentEmail ?? '');
  const [universityId, setUniversityId] = useState(initial?.universityId ?? '');
  const [course, setCourse] = useState(initial?.course ?? '');
  const [status, setStatus] = useState<ApplicationStatus>(initial?.status ?? 'application_started');
  const [deadline, setDeadline] = useState(initial?.deadline?.split('T')[0] ?? '');
  const [fee, setFee] = useState(String(initial?.fee ?? 0));
  const [intake, setIntake] = useState(initial?.intake ?? INTAKES[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!studentName.trim()) e.studentName = 'Student name is required';
    if (!studentEmail.trim()) e.studentEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) e.studentEmail = 'Invalid email address';
    if (!universityId) e.universityId = 'University is required';
    if (!course.trim()) e.course = 'Course is required';
    if (!deadline) e.deadline = 'Deadline is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      universityId,
      course: course.trim(),
      status,
      deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
      fee: parseFloat(fee) || 0,
      intake,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Student name *" value={studentName} onChange={(e) => setStudentName(e.target.value)} error={errors.studentName} />
        <Input label="Student email *" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} error={errors.studentEmail} />
      </div>
      <Select label="University *" value={universityId} onChange={(e) => setUniversityId(e.target.value)} error={errors.universityId}>
        <option value="">Select university</option>
        {data.universities.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </Select>
      <Input label="Course *" value={course} onChange={(e) => setCourse(e.target.value)} error={errors.course} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
          {APPLICATION_STAGES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </Select>
        <Select label="Intake" value={intake} onChange={(e) => setIntake(e.target.value)}>
          {INTAKES.map((i) => <option key={i} value={i}>{i}</option>)}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Deadline *" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} error={errors.deadline} />
        <Input label="Fee (£)" type="number" value={fee} onChange={(e) => setFee(e.target.value)} min="0" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial?.id ? 'Save changes' : 'Create application'}</Button>
      </div>
    </form>
  );
}
