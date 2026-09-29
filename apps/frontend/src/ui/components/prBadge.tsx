import { GenderFemale, GenderMale, UsersThree } from '@phosphor-icons/react';
import type { Bar } from '@nightlist/mock';

/**
 * ป้าย PR ประจำร้าน — ร้านกรอกเอง
 * compact: "PR ♂2 ♀5" ในการ์ด · เต็ม: การ์ดเล็กในหน้าร้าน
 */
export function PRBadge({ pr, compact = false }: { pr: Bar['pr']; compact?: boolean }) {
  const total = pr.male + pr.female;
  if (compact) {
    if (!total) return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted">
        <UsersThree size={12} /> PR
        {pr.male > 0 && (
          <span className="inline-flex items-center">
            <GenderMale size={12} className="text-sky-400" />
            {pr.male}
          </span>
        )}
        {pr.female > 0 && (
          <span className="inline-flex items-center">
            <GenderFemale size={12} className="text-pink-400" />
            {pr.female}
          </span>
        )}
      </span>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
        <UsersThree /> PR ประจำร้าน
      </p>
      {total === 0 ? (
        <p className="text-sm text-muted">ร้านนี้ไม่มี PR</p>
      ) : (
        <div className="flex gap-4 text-sm">
          <span className="inline-flex items-center gap-1">
            <GenderMale className="text-sky-400" /> ชาย {pr.male} คน
          </span>
          <span className="inline-flex items-center gap-1">
            <GenderFemale className="text-pink-400" /> หญิง {pr.female} คน
          </span>
        </div>
      )}
      <p className="mt-1 text-xs text-muted">ข้อมูลจากร้านโดยตรง</p>
    </div>
  );
}
