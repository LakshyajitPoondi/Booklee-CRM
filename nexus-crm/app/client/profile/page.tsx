'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCrm } from '@/context/CrmContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ClientProfilePage() {
  const { user: authUser, refreshProfile } = useAuth();
  const { user, updatePersonalInfo, uploadProfileAvatar } = useCrm();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updatePersonalInfo({ name, email: user.email, phone, role: user.role });
    setEditing(false);
  };

  const handleAvatarUpload = async () => {
    const file = avatarRef.current?.files?.[0];
    if (!file) return;
    try {
      setAvatarUploading(true);
      await uploadProfileAvatar(file);
      await refreshProfile();
    } catch {
      alert('Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">My Profile</h1>
        <p className="text-sm text-[#6B7280] mt-1">Manage your personal information.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-[#111827]">Personal Information</h3>
          {!editing ? (
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              <span className="material-symbols-outlined text-base">edit</span>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-5">
          <div className="relative group">
            {authUser?.avatarUrl ? (
              <img src={authUser.avatarUrl} alt={authUser.fullName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#6B5B73] flex items-center justify-center">
                <span className="text-white text-2xl font-medium">{user.avatarInitial}</span>
              </div>
            )}
            <button
              onClick={() => avatarRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-white text-sm">camera_alt</span>
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          {editing ? (
            <div className="grid grid-cols-2 gap-4 flex-1">
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Email" value={user.email} disabled />
              <Input label="Role" value={user.role} disabled />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 flex-1">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Full name</p>
                <p className="text-sm font-medium text-[#111827]">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Email</p>
                <p className="text-sm text-[#111827]">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Role</p>
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#374151]">{user.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
