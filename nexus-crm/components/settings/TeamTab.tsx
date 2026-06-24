'use client';

import { useState } from 'react';
import { useCrm } from '@/context/CrmContext';
import type { TeamMember } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function TeamTab() {
  const { data, addTeamMember, removeTeamMember } = useCrm();
  const { teamMembers } = data.settings;

  const [inviteOpen, setInviteOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Viewer');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeCount = teamMembers.filter((m) => m.status === 'active').length;
  const pendingCount = teamMembers.filter((m) => m.status === 'pending').length;

  const handleInvite = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    addTeamMember({ name: name.trim(), email: email.trim(), role });
    setInviteOpen(false);
    setName('');
    setEmail('');
    setRole('Viewer');
    setErrors({});
  };

  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      removeTeamMember(id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-[#111827]">Team Members</h3>
        <Button variant="secondary" size="sm" onClick={() => setInviteOpen(true)}>
          <span className="material-symbols-outlined text-base">add</span>
          Invite Member
        </Button>
      </div>
      <p className="text-sm text-[#6B7280] mb-5">{activeCount} active · {pendingCount} pending invite</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB]">
              <th className="pb-3 pr-4 font-medium">Member</th>
              <th className="pb-3 pr-4 font-medium">Role</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Joined</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b border-[#F3F4F6] last:border-0">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#6B5B73] flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-medium">{member.avatarInitial}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{member.name}</p>
                      <p className="text-xs text-[#6B7280]">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[#111827] text-white">
                    {member.role}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <span className={`inline-flex items-center gap-1.5 text-sm ${member.status === 'active' ? 'text-[#15803d]' : 'text-[#ea580c]'}`}>
                    <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-[#15803d]' : 'bg-[#ea580c]'}`} />
                    {member.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td className="py-4 pr-4 text-[#6B7280]">
                  {member.status === 'active'
                    ? new Date(member.joinedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                </td>
                <td className="py-4">
                  {teamMembers.length > 1 && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="p-1 rounded hover:bg-[#F5F6F8] transition-colors cursor-pointer"
                      aria-label="Remove member"
                    >
                      <span className="material-symbols-outlined text-[#6B7280] text-lg">delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={inviteOpen} onClose={() => { setInviteOpen(false); setErrors({}); }} title="Invite Team Member" maxWidth="max-w-md">
        <div className="space-y-4">
          <Input label="Full name *" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
          <Input label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as TeamMember['role'])}>
            <option value="Admin">Admin</option>
            <option value="Counselor">Counselor</option>
            <option value="Viewer">Viewer</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setInviteOpen(false); setErrors({}); }}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
