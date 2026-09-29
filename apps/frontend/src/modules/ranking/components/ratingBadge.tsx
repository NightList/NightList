/** ป้ายคะแนนรีวิว สีตามระดับ (Figma: ทอง ≥4.6 · ม่วง ≥4.0 · น้ำเงิน ≥3.0 · เทา ต่ำกว่า) */
export function RatingBadge({ rating }: { rating: number }) {
  const tone =
    rating >= 4.6
      ? 'bg-gold text-on-gold'
      : rating >= 4
        ? 'bg-purple text-white'
        : rating >= 3
          ? 'bg-[#5b6fd6] text-white'
          : 'bg-[#6b6f80] text-white';
  return (
    <span
      className={`grid h-9 w-11 shrink-0 place-items-center rounded-lg text-sm font-bold tabular-nums ${tone}`}
      aria-label={`คะแนนรีวิว ${rating.toFixed(1)}`}
    >
      {rating.toFixed(1)}
    </span>
  );
}
