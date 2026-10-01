import type { ReviewMedia } from '@nightlist/mock';
import { getBlob } from '@/services/mediaStore';
import { log } from '@/services/log';
import { supabase } from '@/services/supabase';

/**
 * อัปโหลดไฟล์เข้า Supabase Storage ตาม policy ของแต่ละ bucket (โฟลเดอร์แรก = เจ้าของ)
 *   deposit-slips/<user_id>/...   review-media/<user_id>/<review_id>/...   promo-slips/<bar_id>/...
 * NestJS รับแค่ path แล้วตรวจโฟลเดอร์ซ้ำในฐานข้อมูล
 */
const ext = (f: Blob) =>
  ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm' })[f.type] ?? 'bin';

async function upload(bucket: string, path: string, file: Blob): Promise<string> {
  if (!supabase) throw new Error('ยังไม่ได้ตั้งค่า Supabase');
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) {
    log.error(`อัปโหลดไฟล์ไม่สำเร็จ ${bucket}/${path}`, error.message);
    throw new Error(`อัปโหลดไฟล์ไม่สำเร็จ: ${error.message}`);
  }
  log.info(`อัปโหลดไฟล์ ${bucket}/${path} (${Math.round(file.size / 1024)} KB)`);
  return path;
}

export const dataUrlToBlob = async (dataUrl: string) => (await fetch(dataUrl)).blob();

export function uploadDepositSlip(userId: string, bookingId: string, file: Blob) {
  return upload('deposit-slips', `${userId}/${bookingId}-${Date.now()}.${ext(file)}`, file);
}

export function uploadPromoSlip(barId: string, file: Blob) {
  return upload('promo-slips', `${barId}/${Date.now()}.${ext(file)}`, file);
}

export function uploadSafetyEvidence(barId: string, key: string, file: Blob) {
  return upload('bar-verifications', `${barId}/safety-${key.toLowerCase()}-${Date.now()}.${ext(file)}`, file);
}

/** อัปโหลดรูป/วิดีโอจากตัวเลือกรีวิว (รูป = data URL ที่ย่อแล้ว · วิดีโอ = ไฟล์ใน IndexedDB) */
export async function uploadReviewMedia(userId: string, reviewId: string, media: ReviewMedia[]) {
  const out: { path: string; kind: 'IMAGE' | 'VIDEO'; thumb_path?: string; duration_sec?: number; size_bytes?: number }[] = [];
  for (const [i, m] of media.entries()) {
    const base = `${userId}/${reviewId}/${i + 1}`;
    if (m.type === 'image') {
      if (!m.src) continue;
      const blob = await dataUrlToBlob(m.src);
      out.push({ path: await upload('review-media', `${base}.${ext(blob)}`, blob), kind: 'IMAGE', size_bytes: blob.size });
    } else {
      const blob = m.blobKey ? await getBlob(m.blobKey) : null;
      if (!blob) continue;
      const path = await upload('review-media', `${base}.${ext(blob)}`, blob);
      const thumb = m.poster ? await upload('review-media', `${base}-poster.jpg`, await dataUrlToBlob(m.poster)) : undefined;
      out.push({ path, kind: 'VIDEO', thumb_path: thumb, duration_sec: m.duration ? Math.round(m.duration) : undefined, size_bytes: blob.size });
    }
  }
  return out;
}

/** URL ชั่วคราวของไฟล์ส่วนตัว (เช่นสลิปของฉัน) */
export async function signedUrl(bucket: string, path: string, seconds = 600) {
  if (!supabase) return null;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, seconds);
  return data?.signedUrl ?? null;
}
