import { Play } from '@phosphor-icons/react';
import type { ReviewMedia } from '@/services/data';
import { Image, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { getBlob } from '@/services/mediaStore';
import { fmtDuration } from '@/ui/utils/media';

/** URL เล่นวิดีโอ: src (URL ชั่วคราวจาก Supabase Storage) หรือ blob จาก IndexedDB (ไฟล์ที่เพิ่งเลือก ยังไม่อัปโหลด) */
function useVideoUrl(m: ReviewMedia | null) {
  const [loaded, setLoaded] = useState<{ id: string; url: string | null }>({ id: '', url: null });
  const blobKey = m && !m.src ? m.blobKey : undefined;
  useEffect(() => {
    if (!blobKey) return;
    let obj: string | null = null;
    let cancelled = false;
    void getBlob(blobKey)
      .catch(() => null)
      .then((b) => {
        if (cancelled) return;
        obj = b ? URL.createObjectURL(b) : null;
        setLoaded({ id: blobKey, url: obj });
      });
    return () => {
      cancelled = true;
      if (obj) URL.revokeObjectURL(obj);
    };
  }, [blobKey]);
  if (!m) return { url: null, missing: false };
  if (m.src) return { url: m.src, missing: false };
  if (loaded.id !== m.blobKey) return { url: null, missing: false };
  return { url: loaded.url, missing: !loaded.url };
}

/** แถบรูป/วิดีโอใต้รีวิว — รูปกดดูเต็มจอ (เลื่อนดูทีละรูป) · วิดีโอกดแล้วเล่นในหน้าต่าง */
export function ReviewMediaGallery({ media }: { media: ReviewMedia[] }) {
  const [playing, setPlaying] = useState<ReviewMedia | null>(null);
  const { url, missing } = useVideoUrl(playing);
  const images = media.filter((m) => m.type === 'image');
  const videos = media.filter((m) => m.type === 'video');

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {videos.map((v) => (
        <button
          key={v.id}
          type="button"
          aria-label={`เล่นวิดีโอ${v.duration ? ` ${fmtDuration(v.duration)}` : ''}`}
          onClick={() => setPlaying(v)}
          className="relative size-20 touch-manipulation overflow-hidden rounded-lg border border-border bg-card transition-transform active:scale-95 sm:size-24"
        >
          {v.poster && <img src={v.poster} alt="" className="size-full object-cover" />}
          <span className="absolute inset-0 grid place-items-center bg-black/30">
            <span className="grid size-9 place-items-center rounded-full bg-white/90 text-[#15131c]">
              <Play weight="fill" size={16} />
            </span>
          </span>
          {!!v.duration && (
            <span className="absolute bottom-1 right-1 rounded bg-black/65 px-1 text-[10px] text-white">
              {fmtDuration(v.duration)}
            </span>
          )}
        </button>
      ))}
      <Image.PreviewGroup>
        {images.map((m) => (
          <Image
            key={m.id}
            src={m.src}
            alt="รูปจากรีวิว"
            width={96}
            height={96}
            className="rounded-lg object-cover"
            rootClassName="overflow-hidden rounded-lg border border-border [&_img]:!size-20 sm:[&_img]:!size-24"
          />
        ))}
      </Image.PreviewGroup>
      <Modal
        open={!!playing}
        onCancel={() => setPlaying(null)}
        footer={null}
        centered
        destroyOnHidden
        width={720}
        title="วิดีโอจากรีวิว"
      >
        {url ? (
          <video src={url} poster={playing?.poster} controls autoPlay playsInline className="max-h-[70vh] w-full rounded-lg bg-black" />
        ) : (
          <p className="py-10 text-center text-sm text-muted">
            {missing ? 'เปิดวิดีโอไม่ได้ ลองรีเฟรชหน้า' : 'กำลังโหลดวิดีโอ…'}
          </p>
        )}
      </Modal>
    </div>
  );
}
