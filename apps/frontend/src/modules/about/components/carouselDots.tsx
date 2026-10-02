/** จุดบอกตำแหน่งโคราเซล — จุดที่เลือกยืดเป็นขีด */
export function CarouselDots({
  labels,
  active,
  onSelect,
}: {
  labels: string[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="relative z-40 mt-2 flex justify-center gap-2" role="group" aria-label="เลือกทีมงาน">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`ดู ${label}`}
          aria-current={i === active ? 'true' : undefined}
          className="grid size-6 place-items-center rounded-full"
        >
          <span
            className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
          />
        </button>
      ))}
    </div>
  );
}
