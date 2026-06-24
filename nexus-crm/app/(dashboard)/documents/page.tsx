'use client';

import { useMemo, useRef, useState } from 'react';
import KpiCard from '@/components/ui/KpiCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { useCrm } from '@/context/CrmContext';
import { DOCUMENT_CATEGORIES, DOCUMENT_STATUS_LABELS } from '@/lib/constants';
import { formatShortDate, formatFileSize, downloadDataUrl, cn } from '@/lib/utils';
import type { Document, DocumentCategory, DocumentStatus } from '@/types';

export default function DocumentsPage() {
  const { data, addDocument, updateDocument, deleteDocument, isLoaded } = useCrm();
  const [category, setCategory] = useState<DocumentCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('passport');
  const [uploadStudent, setUploadStudent] = useState('');
  const [uploadStatus, setUploadStatus] = useState<DocumentStatus>('pending_review');

  const filtered = useMemo(() => {
    let result = [...data.documents];
    if (category !== 'all') result = result.filter((d) => d.category === category);
    if (statusFilter) result = result.filter((d) => d.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.studentName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data.documents, category, statusFilter, search]);

  const stats = useMemo(() => ({
    total: data.documents.length,
    verified: data.documents.filter((d) => d.status === 'verified').length,
    pending: data.documents.filter((d) => d.status === 'pending_review').length,
    expired: data.documents.filter((d) => d.status === 'expired').length,
  }), [data.documents]);

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !uploadName.trim() || !uploadStudent.trim()) return;

    const reader = new FileReader();
    reader.onload = () => {
      addDocument({
        name: uploadName.trim(),
        category: uploadCategory,
        status: uploadStatus,
        studentName: uploadStudent.trim(),
        studentId: uploadStudent.trim().toLowerCase().replace(/\s+/g, '-'),
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        dataUrl: reader.result as string,
      });
      setUploadOpen(false);
      setUploadName('');
      setUploadStudent('');
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (doc: Document) => {
    if (doc.dataUrl) downloadDataUrl(doc.dataUrl, doc.name);
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64"><p className="text-sm text-[#6B7280]">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Documents</h1>
          <p className="text-sm text-[#6B7280] mt-1">Document vault for student files.</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <span className="material-symbols-outlined text-lg">upload</span>
          Upload document
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total documents" value={stats.total} />
        <KpiCard label="Verified" value={stats.verified} trend="+5%" />
        <KpiCard label="Pending review" value={stats.pending} />
        <KpiCard label="Expired" value={stats.expired} trend="-2%" trendUp={false} />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {DOCUMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer',
              category === cat.key
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB]'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg">search</span>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white cursor-pointer"
        >
          <option value="">All statuses</option>
          {Object.entries(DOCUMENT_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] card-shadow overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-12">No documents found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-5 py-3 font-medium">Document</th>
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Uploaded</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                    <td className="px-5 py-4 font-medium text-[#111827]">{doc.name}</td>
                    <td className="px-5 py-4 text-[#374151]">{doc.studentName}</td>
                    <td className="px-5 py-4 text-[#374151] capitalize">{doc.category.replace('_', ' ')}</td>
                    <td className="px-5 py-4">
                      <select
                        value={doc.status}
                        onChange={(e) => updateDocument(doc.id, { status: e.target.value as DocumentStatus })}
                        className="text-xs border border-[#E5E7EB] rounded px-2 py-1 bg-white cursor-pointer"
                      >
                        {Object.entries(DOCUMENT_STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-[#374151]">{formatFileSize(doc.fileSize)}</td>
                    <td className="px-5 py-4 text-[#6B7280]">{formatShortDate(doc.uploadedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(doc)}>Preview</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>Download</Button>
                        <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this document?')) deleteDocument(doc.id); }}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload modal */}
      <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload document" maxWidth="max-w-lg">
        <div className="space-y-4">
          <Input label="Document name *" value={uploadName} onChange={(e) => setUploadName(e.target.value)} />
          <Input label="Student name *" value={uploadStudent} onChange={(e) => setUploadStudent(e.target.value)} />
          <Select label="Category" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}>
            {DOCUMENT_CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </Select>
          <Select label="Status" value={uploadStatus} onChange={(e) => setUploadStatus(e.target.value as DocumentStatus)}>
            {Object.entries(DOCUMENT_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">File *</label>
            <input ref={fileRef} type="file" className="w-full text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      </Modal>

      {/* Preview modal */}
      <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc?.name ?? 'Preview'} maxWidth="max-w-2xl">
        {previewDoc && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#6B7280]">Student:</span> {previewDoc.studentName}</div>
              <div><span className="text-[#6B7280]">Category:</span> {previewDoc.category}</div>
              <div><span className="text-[#6B7280]">Status:</span> {DOCUMENT_STATUS_LABELS[previewDoc.status]}</div>
              <div><span className="text-[#6B7280]">Size:</span> {formatFileSize(previewDoc.fileSize)}</div>
            </div>
            {previewDoc.dataUrl && previewDoc.fileType.startsWith('image/') ? (
              <img src={previewDoc.dataUrl} alt={previewDoc.name} className="max-w-full rounded-lg border border-[#E5E7EB]" />
            ) : previewDoc.dataUrl && previewDoc.fileType === 'application/pdf' ? (
              <iframe src={previewDoc.dataUrl} className="w-full h-96 rounded-lg border border-[#E5E7EB]" title={previewDoc.name} />
            ) : (
              <p className="text-sm text-[#6B7280]">Preview not available for this file type. Use download instead.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
