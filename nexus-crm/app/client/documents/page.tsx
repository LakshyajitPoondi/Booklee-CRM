'use client';

import { useCrm } from '@/context/CrmContext';
import { DOCUMENT_STATUS_LABELS } from '@/lib/constants';
import { formatShortDate, formatFileSize } from '@/lib/utils';
import { getDocumentUrl } from '@/services/documents';
import Button from '@/components/ui/Button';

export default function ClientDocumentsPage() {
  const { data, isLoaded } = useCrm();

  const handleDownload = async (doc: typeof data.documents[number]) => {
    try {
      if (doc.storagePath) {
        const url = await getDocumentUrl(doc.storagePath);
        window.open(url, '_blank');
      }
    } catch {
      alert('Failed to download document');
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64"><p className="text-sm text-[#6B7280]">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">My Documents</h1>
        <p className="text-sm text-[#6B7280] mt-1">View your uploaded documents.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] card-shadow overflow-hidden">
        {data.documents.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-12">No documents found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6B7280] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-5 py-3 font-medium">Document</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Uploaded</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                    <td className="px-5 py-4 font-medium text-[#111827]">{doc.name}</td>
                    <td className="px-5 py-4 text-[#374151] capitalize">{doc.category.replace('_', ' ')}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                        {DOCUMENT_STATUS_LABELS[doc.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#374151]">{formatFileSize(doc.fileSize)}</td>
                    <td className="px-5 py-4 text-[#6B7280]">{formatShortDate(doc.uploadedAt)}</td>
                    <td className="px-5 py-4">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
