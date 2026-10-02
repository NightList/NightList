import { User } from '@phosphor-icons/react';

/** รูปทีมงาน (ชิดบนให้เห็นหน้า) · ไม่มีรูป → เงาคนบนพื้นม่วงเข้ม */
export function TeamPortrait({ photo, alt, className = '' }: { photo: string | null; alt: string; className?: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`absolute inset-0 size-full object-cover object-top ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 bg-[linear-gradient(170deg,#2b1a47_0%,#160d27_100%)] ${className}`}
    >
      <User weight="fill" className="absolute bottom-[-6%] left-1/2 size-[86%] -translate-x-1/2 text-white/12" />
    </span>
  );
}
