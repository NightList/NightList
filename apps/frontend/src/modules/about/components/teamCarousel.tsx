import { User } from '@phosphor-icons/react';
import { useReducedMotion } from 'motion/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { TEAM, type TeamMember } from '../utils/content';

/**
 * ทีมงาน — โคราเซลแบบวงล้อ (Figma: ทีมงาน)
 * คนกลางใหญ่อยู่ในกรอบกระจก · ซ้าย/ขวาเล็กลงและเอียงออก · ที่เหลือซ่อนอยู่หลังขอบจอ
 * หมุนเองทุก 3.5 วิ · ลาก/ปัดได้ · กดการ์ดข้าง ๆ หรือจุดด้านล่างเพื่อไปหาคนนั้น · ลูกศรซ้าย/ขวาบนคีย์บอร์ด
 * หยุดหมุนเมื่อชี้เมาส์/โฟกัส/ลาก/เลื่อนออกนอกจอ/สลับแท็บ · ผู้ใช้ที่ปิดการเคลื่อนไหว: ไม่หมุนเอง ไม่มีการเลื่อนตำแหน่ง (เฟดอย่างเดียว)
 *
 * ขนาดทุกอย่างวัดจาก Figma กว้าง 1600 แล้วคูณ s (สเกลตามความกว้างจริง)
 */
const AUTOPLAY_MS = 3500;
const SWIPE_PX = 40;
const EASE_MOVE = 'cubic-bezier(0.77, 0, 0.175, 1)'; // skill animate: ease-in-out สำหรับของที่เคลื่อนบนจอ

/** ขนาดจริงเทียบ Figma (Figma ใหญ่ไปเมื่อเปิดบนจอจริง) */
const SCALE = 0.72;
const CARD = { w: 410, h: 540, r: 72 };
const FRAME = { w: 510, h: 633, r: 72 };

interface Pose {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
  z: number;
  /** ตัดบน-ล่างให้การ์ดข้าง ๆ ออกมาเกือบเหลี่ยมจัตุรัสเหมือน Figma (clip-path ไม่ทำให้ layout ขยับ) */
  clipY: number;
}

function poseFor(offset: number): Pose {
  const side = Math.sign(offset);
  const d = Math.abs(offset);
  if (d === 0) return { x: 0, y: 0, rot: 0, scale: 1, opacity: 1, z: 30, clipY: 0 };
  if (d === 1)
    return { x: 505 * side, y: 92, rot: 16 * side, scale: 0.8, opacity: 1, z: 20, clipY: 48 };
  if (d === 2)
    return { x: 900 * side, y: 300, rot: 32 * side, scale: 0.62, opacity: 0, z: 10, clipY: 48 };
  return { x: 1150 * side, y: 420, rot: 40 * side, scale: 0.5, opacity: 0, z: 0, clipY: 48 };
}

/** ระยะห่างแบบวงกลม: ช่วง [-n/2, n/2) */
function circularOffset(i: number, active: number, n: number) {
  return ((((i - active) % n) + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
}

function useScale(ref: React.RefObject<HTMLElement | null>) {
  const [s, setS] = useState(0.8);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      // ย่อจากขนาด Figma ลงเหลือ 72% · มือถือเทียบเวที 900 (เห็นการ์ดข้าง ๆ โผล่ที่ขอบจอ)
      const byWidth = w < 768 ? w / 900 : (Math.min(w, 1600) / 1600) * SCALE;
      // จอเตี้ย (โน้ตบุ๊ก) → กรอบกลางสูงไม่เกิน 58% ของความสูงจอ จะได้เห็นทั้งการ์ดในจอเดียว
      const byHeight = (window.innerHeight * 0.58) / FRAME.h;
      setS(Math.min(byWidth, byHeight));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref]);
  return s;
}

export function TeamCarousel({ team = TEAM }: { team?: TeamMember[] }) {
  const n = team.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const s = useScale(rootRef);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const drag = useRef<{ x: number; id: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);
  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

  // หยุดเมื่อเลื่อนออกนอกจอ / สลับแท็บ
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const autoplay = !reduce && !hovered && !focused && inView && visible;
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [autoplay, next, active]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, id: e.pointerId, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d && d.id === e.pointerId && Math.abs(e.clientX - d.x) > 6 && !d.moved) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    suppressClick.current = !!d?.moved;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (dx <= -SWIPE_PX) next();
    else if (dx >= SWIPE_PX) prev();
  };

  const moveT = reduce ? '0ms' : '700ms';
  const current = team[active]!;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="ทีมงาน NightList"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          next();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prev();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      className="relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      <div
        className="relative mx-auto touch-pan-y select-none"
        style={{ height: (FRAME.h + 150) * s }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        {/* กรอบกระจกของคนกลาง — อยู่กับที่ การ์ดหมุนผ่านเข้า-ออก */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 border-[1.5px] border-white/30 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_30px_80px_-30px_rgba(40,0,90,0.6)] backdrop-blur-[2px]"
          style={{
            top: 8 * s,
            width: FRAME.w * s,
            height: FRAME.h * s,
            marginLeft: (-FRAME.w * s) / 2,
            borderRadius: FRAME.r * s,
          }}
        />

        {team.map((m, i) => {
          const offset = circularOffset(i, active, n);
          const p = poseFor(offset);
          const isActive = offset === 0;
          const clip = p.clipY * s;
          const style: CSSProperties = {
            top: (8 + (FRAME.h - CARD.h) / 2) * s,
            width: CARD.w * s,
            height: CARD.h * s,
            marginLeft: (-CARD.w * s) / 2,
            zIndex: p.z,
            opacity: p.opacity,
            transform: `translate3d(${p.x * s}px, ${p.y * s}px, 0) rotate(${p.rot}deg) scale(${p.scale})`,
            clipPath: `inset(${clip}px 0 ${clip}px 0 round ${CARD.r * s}px)`,
            transition: `transform ${moveT} ${EASE_MOVE}, clip-path ${moveT} ${EASE_MOVE}, opacity ${reduce ? 250 : 450}ms ease`,
            pointerEvents: Math.abs(offset) <= 1 ? 'auto' : 'none',
          };
          return (
            <div
              key={m.name}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} จาก ${n}: ${m.name}`}
              aria-hidden={Math.abs(offset) > 1}
              className="absolute left-1/2 will-change-transform"
              style={style}
            >
              <button
                type="button"
                tabIndex={-1}
                onClick={() => {
                  if (suppressClick.current) return;
                  if (!isActive) go(i);
                }}
                className={`team-card group relative block size-full overflow-hidden text-left ${isActive ? 'is-active cursor-default' : 'cursor-pointer'}`}
                style={{ borderRadius: CARD.r * s }}
                aria-label={isActive ? undefined : `ดู ${m.name}`}
              >
                <Portrait member={m} index={i} />
                <span
                  className="absolute inset-x-0 flex flex-col items-center px-[6%] text-center"
                  style={{ bottom: (40 + p.clipY) * s }}
                >
                  <span
                    className="team-card__name font-kanit font-semibold leading-tight"
                    style={{ fontSize: 40 * s }}
                  >
                    {m.name}
                  </span>
                  <span
                    className="font-poppins font-semibold leading-tight text-[#e8b64c] [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]"
                    style={{ fontSize: 20 * s }}
                  >
                    {m.role}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* จุดบอกตำแหน่ง */}
      <div
        className="relative z-40 mt-2 flex justify-center gap-2"
        role="group"
        aria-label="เลือกทีมงาน"
      >
        {team.map((m, i) => (
          <button
            key={m.name}
            type="button"
            onClick={() => go(i)}
            aria-label={`ดู ${m.name}`}
            aria-current={i === active ? 'true' : undefined}
            className="grid size-6 place-items-center rounded-full"
          >
            <span
              className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
            />
          </button>
        ))}
      </div>

      {/* ผู้อ่านหน้าจอ: บอกคนปัจจุบันเฉพาะตอนผู้ใช้เป็นคนเปลี่ยน (ไม่พูดทุก 3.5 วิ ตอนหมุนเอง) */}
      <p className="sr-only" aria-live={autoplay ? 'off' : 'polite'}>
        {current.name} — {current.role}
      </p>
    </div>
  );
}

const TINTS = [
  'linear-gradient(160deg,#f1eff7 0%,#d9d5e4 100%)',
  'linear-gradient(160deg,#d4d4d8 0%,#a9a9b2 100%)',
  'linear-gradient(160deg,#e9e4f5 0%,#c6bde0 100%)',
];

/** รูปทีมงาน — ยังไม่มีรูปจริง → เงาคนบนพื้นสตูดิโอโทนเทา/ม่วงอ่อน */
function Portrait({ member, index }: { member: TeamMember; index: number }) {
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0"
      style={{ background: TINTS[index % TINTS.length] }}
    >
      <User
        weight="fill"
        className="absolute bottom-[-6%] left-1/2 size-[92%] -translate-x-1/2 text-[#8f8aa3]/70"
      />
    </span>
  );
}
