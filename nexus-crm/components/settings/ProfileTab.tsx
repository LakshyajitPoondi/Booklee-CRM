'use client';

import { useState } from 'react';
import { useCrm } from '@/context/CrmContext';
import type { CompanyProfile, PersonalInfo } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function ProfileTab() {
  const { data, user, updateCompanyProfile, updatePersonalInfo } = useCrm();
  const { companyProfile, personalInfo } = data.settings;

  const [editingCompany, setEditingCompany] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [company, setCompany] = useState<CompanyProfile>(companyProfile);
  const [personal, setPersonal] = useState<PersonalInfo>(personalInfo);

  const handleSaveCompany = () => {
    updateCompanyProfile(company);
    setEditingCompany(false);
  };

  const handleSavePersonal = () => {
    updatePersonalInfo(personal);
    setEditingPersonal(false);
  };

  return (
    <div className="space-y-6">
      {/* Company Profile */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-[#111827]">Company Profile</h3>
          {!editingCompany ? (
            <Button variant="secondary" size="sm" onClick={() => { setCompany(companyProfile); setEditingCompany(true); }}>
              <span className="material-symbols-outlined text-base">edit</span>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditingCompany(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveCompany}>Save</Button>
            </div>
          )}
        </div>

        {editingCompany ? (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company name" value={company.companyName} onChange={(e) => setCompany({ ...company, companyName: e.target.value })} />
            <Input label="Founded" value={company.founded} onChange={(e) => setCompany({ ...company, founded: e.target.value })} />
            <Input label="Address" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
            <Input label="Phone" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
            <Input label="Email" type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
            <Input label="Website" value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-5 gap-x-8">
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Company name</p>
              <p className="text-sm text-[#111827]">{companyProfile.companyName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Founded</p>
              <p className="text-sm text-[#111827]">{companyProfile.founded || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Address</p>
              <p className="text-sm text-[#111827] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#6B7280]">location_on</span>
                {companyProfile.address || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Phone</p>
              <p className="text-sm text-[#111827] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#6B7280]">call</span>
                {companyProfile.phone || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Email</p>
              <p className="text-sm text-[#111827] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#6B7280]">mail</span>
                {companyProfile.email || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Website</p>
              <p className="text-sm text-[#111827] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#6B7280]">language</span>
                {companyProfile.website || '—'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-[#111827]">Personal Information</h3>
          {!editingPersonal ? (
            <Button variant="secondary" size="sm" onClick={() => { setPersonal(personalInfo); setEditingPersonal(true); }}>
              <span className="material-symbols-outlined text-base">edit</span>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditingPersonal(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSavePersonal}>Save</Button>
            </div>
          )}
        </div>

        {editingPersonal ? (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full name" value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
            <Input label="Role" value={personal.role} onChange={(e) => setPersonal({ ...personal, role: e.target.value })} />
            <Input label="Email" type="email" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
            <Input label="Phone" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
          </div>
        ) : (
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[#6B5B73] flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-medium">{user.avatarInitial}</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 flex-1">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Full name</p>
                <p className="text-sm font-medium text-[#111827]">{personalInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Role</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                  <span className="material-symbols-outlined text-xs">shield</span>
                  {personalInfo.role}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Email</p>
                <p className="text-sm text-[#111827] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#6B7280]">mail</span>
                  {personalInfo.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                <p className="text-sm text-[#111827] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#6B7280]">call</span>
                  {personalInfo.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 card-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#dc2626]">Danger Zone</h3>
            <p className="text-sm text-[#6B7280] mt-1">Permanently delete your account and all of your data. This action is irreversible and cannot be undone.</p>
          </div>
          <Button variant="danger" onClick={() => setDeleteConfirm(true)}>Delete Account</Button>
        </div>
      </div>

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Delete Account" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setDeleteConfirm(false)}>Confirm Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
