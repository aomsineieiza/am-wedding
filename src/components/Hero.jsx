import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, ChevronDown, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Hero() {
  const { couple, venue } = weddingData;

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

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
    <header className="relative min-h-screen flex flex-col items-center justify-between pt-28 pb-16 px-4 sm:px-6 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
      {/* Background Subtle Grid / Soft Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#CBD5E1_0.75px,transparent_0.75px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0074E2]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Center Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center text-center my-auto">
        {/* Fastwork-style Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FE] border border-[#C4DDFB] text-[#0074E2] text-xs font-semibold shadow-xs mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Save The Date • 28 พฤศจิกายน 2569</span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold mb-2">
            WELCOME TO OUR WEDDING
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            <span>{couple.bride}</span>
            <span className="inline-block mx-3 sm:mx-5 font-serif italic text-[#0074E2] font-normal text-3xl sm:text-5xl md:text-6xl">
              &amp;
            </span>
            <span>{couple.groom}</span>
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-600 mt-2 font-light">
            &ldquo;{couple.quote}&rdquo;
          </p>
        </motion.div>

        {/* Hero Photo Card - Fastwork Card Elevation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4] rounded-3xl p-2.5 bg-white shadow-xl shadow-slate-900/5 border border-slate-200 mt-8 group"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
              alt={`${couple.bride} and ${couple.groom}`}
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

            {/* Bottom Photo Pill */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {couple.brideFull} &amp; {couple.groomFull}
              </span>
              <span className="bg-[#0074E2] text-white px-3 py-1.5 rounded-full font-semibold shadow-xs">
                #AomsinMild2026
              </span>
            </div>
          </div>
        </motion.div>

        {/* Date and Venue Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm text-slate-700"
        >
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs">
            <Calendar className="w-4 h-4 text-[#0074E2]" />
            <span className="font-semibold text-slate-900">{couple.dateFormatted}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs">
            <MapPin className="w-4 h-4 text-[#0074E2]" />
            <span>{venue.name}</span>
          </div>
        </motion.div>

        {/* Fastwork-Style Metrics / Countdown Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 w-full max-w-md mx-auto"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">
            นับถอยหลังสู่วันสำคัญ • LIVE COUNTDOWN
          </p>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { label: 'วัน (Days)', value: timeLeft.days },
              { label: 'ชั่วโมง (Hours)', value: timeLeft.hours },
              { label: 'นาที (Mins)', value: timeLeft.minutes },
              { label: 'วินาที (Secs)', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#0074E2] transition-colors"
              >
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono leading-none">
                  {unit.value}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 font-medium text-center">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fastwork CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#rsvp"
            className="px-8 py-3.5 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-current text-white/90 group-hover:scale-110 transition-transform" />
            <span>RSVP ตอบรับคำเชิญ</span>
          </a>
          <a
            href="#schedule"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0074E2] border border-slate-200 hover:border-[#0074E2] text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            ดูกำหนดการพิธี
          </a>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 mt-6 flex flex-col items-center text-slate-400"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider mb-1">เลื่อนลงเพื่อดูเพิ่มเติม</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </motion.div>
    </header>
  );
}
