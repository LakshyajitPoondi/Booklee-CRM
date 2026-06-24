import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export type BucketName = 'documents' | 'contracts' | 'profile-images';

/**
 * Upload a file to a Supabase Storage bucket
 */
export async function uploadFile(
  bucket: BucketName,
  path: string,
  file: File,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data.path;
}

/**
 * Get a signed URL for private bucket files
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

/**
 * Get a public URL for public bucket files (e.g., profile-images)
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a file from a Supabase Storage bucket
 */
export async function deleteFile(
  bucket: BucketName,
  path: string,
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

/**
 * Upload or replace a profile avatar
 */
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/avatar.${ext}`;

  // Upsert the file (replace if exists)
  const { error } = await supabase.storage
    .from('profile-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  return getPublicUrl('profile-images', path);
}
