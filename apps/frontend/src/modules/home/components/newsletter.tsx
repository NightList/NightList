import { PaperPlaneTilt } from '@phosphor-icons/react';
import { App } from 'antd';
import { useState } from 'react';

/** สมัครรับข่าวสาร (Figma: Main → Newsletter) — เดโม: แค่ตรวจรูปแบบอีเมลแล้วขึ้นข้อความสำเร็จ */
export function Newsletter() {
  const { message } = App.useApp();
  const [email, setEmail] = useState('');

  return (
    <section aria-labelledby="home-news" className="mx-auto max-w-3xl px-4 text-center">
      <h2 id="home-news" className="text-3xl font-bold md:text-5xl">
        สมัครติดต่อข่าวสาร
      </h2>
      <p className="mt-3 text-muted md:text-lg">เพื่อไม่พลาดข่าวดีจากพวกเรา</p>
      <form
        className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-5 dark:border-white/10 dark:bg-[#1b1924]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^\S+@\S+\.\S+$/.test(email)) return void message.warning('กรอกอีเมลให้ถูกต้องก่อนนะ');
          message.success('สมัครรับข่าวสารแล้ว');
          setEmail('');
        }}
      >
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="อีเมล"
          placeholder="อีเมล์คุณ"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-on-gold transition select-none hover:bg-gold-highlight active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <PaperPlaneTilt size={16} weight="fill" />
          Notify Me
        </button>
      </form>
    </section>
  );
}
