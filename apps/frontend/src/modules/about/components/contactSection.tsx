import {
  Briefcase,
  Clock,
  Envelope,
  FacebookLogo,
  InstagramLogo,
  MapPinSimple,
  Phone,
  TiktokLogo,
  YoutubeLogo,
  type Icon,
} from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { CONTACT, SOCIALS } from '../utils/content';

const SOCIAL_ICON: Record<(typeof SOCIALS)[number]['key'], Icon> = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  facebook: FacebookLogo,
  youtube: YoutubeLogo,
};

/** ไอคอน "เวลาทำการ" ใน Figma = กระเป๋าทำงาน + นาฬิกามุมขวาล่าง */
function HoursIcon() {
  return (
    <span className="relative inline-block size-[clamp(44px,4.4vw,70px)]">
      <Briefcase weight="fill" className="size-full" />
      <span className="absolute -bottom-[6%] -right-[8%] grid size-[52%] place-items-center rounded-full bg-black">
        <Clock weight="fill" className="size-[88%]" />
      </span>
    </span>
  );
}

function Item({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-3 text-center">
      <div className="mb-[clamp(10px,1.4vw,22px)] grid h-[clamp(44px,4.4vw,70px)] place-items-center">
        {icon}
      </div>
      <h3 className="font-kanit text-[clamp(20px,2vw,32px)] font-normal leading-tight">{title}</h3>
      <div className="font-poppins mt-[clamp(6px,0.9vw,14px)] space-y-[0.35em] text-[clamp(14px,1.25vw,20px)] font-semibold leading-snug">
        {children}
      </div>
    </div>
  );
}

const icon = 'size-[clamp(44px,4.4vw,70px)]';

/**
 * ติดต่อเรา (Figma: การ์ดกระจก 4 ช่อง + แถบ "ติดต่อเรา" + ตัวหนังสือ NIGHTLIST ยักษ์จม ๆ อยู่ด้านหลัง)
 * การ์ดเป็นกระจกเบลอ → ตัวหนังสือยักษ์ส่วนที่อยู่หลังการ์ดจะเบลอ ส่วนที่ล้นลงมาคมชัด
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 pt-[clamp(80px,9vw,140px)]"
    >
      <div className="relative z-10 mx-auto w-[calc(100%-2rem)] max-w-[1365px] overflow-hidden rounded-[20px] border border-white/10 border-t-white/25 bg-black/35 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="grid grid-cols-2 gap-y-10 px-2 pt-[clamp(40px,6vw,95px)] text-white md:grid-cols-4 md:gap-y-0">
          <Item icon={<Phone weight="fill" className={icon} />} title="โทรศัพท์">
            <a
              href={`tel:${CONTACT.phone.replace(/-/g, '')}`}
              className="!text-white hover:!text-gold"
            >
              {CONTACT.phone}
            </a>
          </Item>
          <Item icon={<Envelope weight="fill" className={icon} />} title="อีเมลล์">
            <a href={`mailto:${CONTACT.email}`} className="break-all !text-white hover:!text-gold">
              {CONTACT.email}
            </a>
          </Item>
          <Item icon={<HoursIcon />} title="เวลาทำการ">
            <p className="font-kanit font-medium">{CONTACT.hours[0]}</p>
            <p>{CONTACT.hours[1]}</p>
          </Item>
          <Item icon={<MapPinSimple weight="fill" className={icon} />} title="ที่อยู่">
            {CONTACT.address.map((a) => (
              <p key={a} className="font-kanit font-medium">
                {a}
              </p>
            ))}
          </Item>
        </div>
        {/* เส้นคั่น 3 เส้น (เฉพาะจอใหญ่) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[clamp(40px,6vw,95px)] hidden md:block"
        >
          {[25, 50, 75].map((l) => (
            <span
              key={l}
              className="absolute top-0 h-[clamp(150px,14.3vw,228px)] w-[3px] -translate-x-1/2 rounded-full bg-white/60"
              style={{ left: `${l}%` }}
            />
          ))}
        </div>

        <div className="mt-[clamp(36px,5vw,80px)] flex flex-wrap items-end justify-between gap-6 px-[clamp(20px,3.3vw,52px)] pb-[clamp(20px,2.2vw,34px)]">
          <h2
            id="contact-title"
            className="relative font-kanit text-[clamp(48px,5.6vw,90px)] font-semibold leading-[0.9] text-white"
          >
            ติดต่อเรา
            <span
              lang="en"
              className="font-poppins absolute right-[-2%] top-[-26%] text-[0.31em] font-bold leading-none text-[#9b3df5]"
            >
              Contact us
            </span>
          </h2>
          <ul className="mb-1 flex gap-[clamp(12px,1.3vw,22px)]">
            {SOCIALS.map((so) => {
              const I = SOCIAL_ICON[so.key];
              return (
                <li key={so.key}>
                  <a
                    href={so.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={so.label}
                    className="grid size-10 place-items-center rounded-lg border border-white/70 !text-white transition-[background-color,border-color] duration-200 ease-out hover:border-white hover:bg-white/10"
                  >
                    <I size={18} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* NIGHTLIST ยักษ์ — ครึ่งบนจมอยู่หลังการ์ด (เบลอ) ล้นลงมาแล้วถูกตัดที่ขอบล่างหน้า */}
      <div aria-hidden="true" className="relative -mt-[8.3vw] h-[13.2vw] overflow-hidden">
        <p className="font-poppins about-giant whitespace-nowrap text-center text-[19.15vw] font-bold leading-[0.7] tracking-[-0.02em]">
          NIGHTLIST
        </p>
      </div>
    </section>
  );
}
