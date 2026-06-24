import { createClient } from '@/lib/supabase/client';
import type {
  DocumentInsert,
  DocumentUpdate,
  DocumentRow,
} from '@/types/database';
import { uploadFile, getSignedUrl, deleteFile } from './storage';

const supabase = createClient();

export async function getDocuments(): Promise<DocumentRow[]> {
  const { data, error } = await (supabase.from('documents') as any)
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDocumentById(
  id: string
): Promise<DocumentRow | null> {
  const { data, error } = await (supabase.from('documents') as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload a document file to Supabase Storage and save metadata to DB
 */
export async function uploadDocument(
  file: File,
  metadata: Omit<DocumentInsert, 'storage_path' | 'file_type' | 'file_size'>,
): Promise<DocumentRow> {
  const userId = metadata.owner_id;
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${userId}/${timestamp}_${safeName}`;

  // Upload file to Supabase Storage
  await uploadFile('documents', storagePath, file);

  // Save metadata to database
  const { data, error } = await (supabase.from('documents') as any)
    .insert({
      ...metadata,
      storage_path: storagePath,
      file_type: file.type || 'application/octet-stream',
      file_size: file.size,
    })
    .select()
    .single();

  if (error) {
    // Clean up uploaded file on metadata insert failure
    await deleteFile('documents', storagePath).catch(() => {});
    throw error;
  }

  return data;
}

export async function updateDocument(
  id: string,
  updates: DocumentUpdate,
): Promise<DocumentRow> {
  const { data, error } = await (supabase.from('documents') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  // Get storage path before deleting
  const doc = await getDocumentById(id);

  const { error } = await (supabase.from('documents') as any).delete().eq('id', id);
  if (error) throw error;

  // Delete file from storage
  if (doc?.storage_path) {
    await deleteFile('documents', doc.storage_path).catch(() => {});
  }
}

/**
 * Get a temporary signed URL for document preview/download
 */
export async function getDocumentUrl(
  storagePath: string,
  expiresIn = 3600,
): Promise<string> {
  return getSignedUrl('documents', storagePath, expiresIn);
}
