import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Heart, ChevronDown } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Hero() {
  const { couple, venue, gallery } = weddingData;
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    if (!gallery || gallery.length <= 1) return;
    const timer = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % gallery.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [gallery]);

  useEffect(() => {
    const targetDate = new Date(couple.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [couple.date]);

  return (
    <header className="relative min-h-screen flex flex-col items-center justify-between pt-24 sm:pt-28 pb-16 px-4 sm:px-6 bg-transparent overflow-hidden">
      {/* Cool Muted Grey-White Ambient Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] bg-[#DCE2E7]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col items-center text-center my-auto">
        {/* ============================================================
            KOREAN MINIMALIST DIE-CUT INVITATION CARD (Main Centerpiece)
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[360px] sm:max-w-[440px] mx-auto bg-[#FAFAFB] rounded-[28px] sm:rounded-[36px] px-7 py-12 sm:px-12 sm:py-16 border border-[#E2E5E9] shadow-[0_28px_65px_-16px_rgba(30,41,59,0.09),0_4px_16px_-2px_rgba(30,41,59,0.04),inset_0_1px_0_#FFFFFF] flex flex-col items-center"
        >
          {/* Subtle Inner Embossed Card Frame Line */}
          <div className="absolute inset-3 sm:inset-4 rounded-[22px] sm:rounded-[28px] border border-[#EFF1F3] pointer-events-none" />

          {/* 1. Spaced-Out Minimalist Couple Names + Solid Tiny Heart (이 종 성 ♥ 홍 예 진 style) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex items-center justify-center gap-2.5 sm:gap-3.5 text-[#27272A] text-xs sm:text-sm font-medium tracking-[0.38em] uppercase mb-8 sm:mb-10 pl-[0.38em]"
          >
            <span>{couple.bride}</span>
            <span className="text-[10px] sm:text-xs text-[#27272A] tracking-normal">♥</span>
            <span>{couple.groom}</span>
          </motion.div>

          {/* 2. Recessed Oval / Capsule Die-Cut Window Frame */}
          <div className="relative flex flex-col items-center">
            <div className="diecut-window-outer rounded-full p-3 sm:p-3.5 w-[195px] sm:w-[235px] aspect-[3/4.15] flex items-center justify-center relative">
              {/* Second Fine Embossed Inner Rim */}
              <div className="w-full h-full rounded-full p-1 border border-[#E5E7EB] bg-[#F4F5F7] flex items-center justify-center">
                {/* Deep Die-Cut Photo Opening */}
                <div className="diecut-window-inner w-full h-full rounded-full overflow-hidden relative bg-[#E5E7EB]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={gallery?.[activePhotoIndex]?.src || couple.heroImage}
                      src={gallery?.[activePhotoIndex]?.src || couple.heroImage}
                      alt={`${couple.bride} and ${couple.groom}`}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      loading="eager"
                      className={`w-full h-full object-cover ${
                        gallery?.[activePhotoIndex]?.objectPosition || 'object-center'
                      }`}
                    />
                  </AnimatePresence>

                  {/* Soft Inner Vignette */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_12px_rgba(15,23,42,0.16)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Minimalist Dot Selector for Die-Cut Window Photos */}
            {gallery && gallery.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {gallery.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    aria-label={`Select photo ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activePhotoIndex === idx
                        ? 'w-5 bg-[#7FA6B5]'
                        : 'w-1.5 bg-[#D4D8DD] hover:bg-[#9CA3AF]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 3. Blind-Embossed Airplane Motif & Vertical Minimalist Caption (결 혼 합 니 다 style) */}
          <div className="mt-7 sm:mt-8 flex flex-col items-center">
            {/* Tactile White Blind-Embossed Airplane Icon */}
            <div className="blind-emboss mb-3" aria-hidden="true">
              <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-7 sm:h-7 fill-current -rotate-12">
                <path d="M28.5 4.5L3.5 14.2c-1 .4-1 1.8.1 2.1l6.4 2 11.8-9.3c.4-.3.9.2.5.6l-9.6 10.5v5.6c0 1.1 1.3 1.6 2 .8l3.3-3.8 5.2 3.8c.8.6 2 .1 2.2-.9L29.9 6c.2-1.1-.5-1.9-1.4-1.5z" />
              </svg>
            </div>

            {/* Vertical Spaced Minimalist Text */}
            <div className="flex flex-col items-center space-y-1 text-[#27272A] text-xs sm:text-sm font-medium tracking-[0.25em] py-1">
              <span>W</span>
              <span>E</span>
              <span>D</span>
              <span>D</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
            </div>

            <p className="text-xs sm:text-sm text-[#52525B] font-medium tracking-[0.18em] mt-3">
              เรากำลังจะแต่งงานกัน
            </p>
            <p className="text-[11px] text-[#71717A] font-light mt-1 max-w-xs leading-relaxed">
              &ldquo;{couple.quote}&rdquo;
            </p>
          </div>

          {/* 4. Minimalist Thin Divider & Date / Venue Details */}
          <div className="w-12 h-[1px] bg-[#E2E5E9] my-6" />

          <div className="space-y-1 text-center">
            <p className="font-editorial-serif text-base sm:text-lg text-[#27272A] tracking-[0.14em] font-semibold">
              2027 . 01 . 23 &nbsp;SAT &nbsp;07:30
            </p>
            <p className="text-xs text-[#6B7280] font-normal">
              {couple.thaiDateFormatted} • {venue.name}
            </p>
          </div>
        </motion.div>

        {/* ============================================================
            MINIMALIST COUNTDOWN & ACTION BUTTONS BELOW CARD
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 w-full max-w-[360px] sm:max-w-[440px] mx-auto"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#71717A] mb-3">
            COUNTING DOWN TO OUR FOREVER
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: 'DAYS', thai: 'วัน', value: timeLeft.days },
              { label: 'HRS', thai: 'ชม.', value: timeLeft.hours },
              { label: 'MINS', thai: 'นาที', value: timeLeft.minutes },
              { label: 'SECS', thai: 'วินาที', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-[#FAFAFB] border border-[#E2E5E9] shadow-2xs"
              >
                <span className="font-editorial-serif text-2xl sm:text-3xl font-semibold text-[#27272A] leading-none">
                  {unit.value}
                </span>
                <span className="text-[9px] tracking-[0.15em] text-[#71717A] mt-1.5 font-medium uppercase">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Minimalist CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#rsvp"
            className="px-7 py-3 rounded-full bg-[#27272A] hover:bg-[#18181B] text-[#FAFAFB] text-xs sm:text-sm font-medium tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-[#E5B5BC]" />
            <span>RSVP ตอบรับคำเชิญ</span>
          </a>
          <a
            href="#schedule"
            className="px-6 py-3 rounded-full bg-[#FAFAFB] hover:bg-white text-[#3F3F46] border border-[#E2E5E9] hover:border-[#A1A1AA] text-xs sm:text-sm font-medium tracking-wide transition-all shadow-2xs cursor-pointer"
          >
            ดูกำหนดการพิธี
          </a>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 mt-8 flex flex-col items-center text-[#9CA3AF]"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] mb-1">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </header>
  );
}
