import { supabase } from '@/lib/supabase';

export const PORTFOLIO_IMAGE_BUCKET = 'portfolio-images';
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/**
 * Validates file signature (magic numbers) to prevent file-type spoofing attacks.
 */
async function validateImageMagicBytes(file: File): Promise<string> {
  const slice = file.slice(0, 12);
  const buffer = await slice.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG signature: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpg';
  }

  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'png';
  }

  // WEBP signature: RIFF .... WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp';
  }

  throw new Error('File content does not match a valid JPEG, PNG, or WEBP image.');
}

export async function uploadPortfolioImage(file: File, folder: string): Promise<string> {
  // 1. Verify MIME type declared by client
  const declaredExtension = IMAGE_EXTENSIONS[file.type];
  if (!declaredExtension) {
    throw new Error('Please choose a JPG, JPEG, PNG, or WEBP image.');
  }

  // 2. Verify file size limit (5 MB)
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Images must be 5 MB or smaller.');
  }

  // 3. Verify magic bytes to prevent spoofed/executable uploads
  const detectedExtension = await validateImageMagicBytes(file);

  // 4. Sanitize folder name to prevent path traversal
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const path = `portfolio/${safeFolder}/${crypto.randomUUID()}.${detectedExtension}`;

  const { error } = await supabase.storage.from(PORTFOLIO_IMAGE_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('Portfolio image upload failed');
    throw new Error('Image upload failed. Please try again.');
  }

  const { data } = supabase.storage.from(PORTFOLIO_IMAGE_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) throw new Error('Image upload completed without a usable image URL.');
  return data.publicUrl;
}
