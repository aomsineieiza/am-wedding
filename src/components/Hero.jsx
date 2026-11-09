import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, ChevronDown } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Hero() {
  const { couple, venue } = weddingData;

  // Live countdown timer state
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
    <header className="relative min-h-screen flex flex-col items-center justify-between pt-12 pb-16 px-4 sm:px-6 overflow-hidden bg-[#FAF8F5]">
      {/* Delicate background decorative pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#C8B89E_0.75px,transparent_0.75px)] [background-size:24px_24px]" />

      {/* Top Monogram Initials Emblem */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center mb-6"
      >
        <div className="w-14 h-14 rounded-full border border-[#C8B89E]/60 flex items-center justify-center p-1 bg-white/60 backdrop-blur-sm shadow-xs">
          <div className="w-full h-full rounded-full border border-dashed border-[#C8B89E]/40 flex items-center justify-center">
            <span className="font-serif text-lg tracking-widest text-[#2D2926] font-medium">
              {couple.initials}
            </span>
          </div>
        </div>
        <p className="mt-2 text-[10px] tracking-[0.3em] uppercase text-[#A38F70] font-sans font-medium">
          Wedding Celebration
        </p>
      </motion.div>

      {/* Main Editorial Hero Centerpiece */}
      <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center text-center my-auto">
        {/* Intro invitation line */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#6B635B] font-sans mb-3"
        >
          Save Our Date
        </motion.p>

        {/* Bride & Groom Names in Serif Luxury */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#2D2926] tracking-tight font-light leading-none"
        >
          <span>{couple.bride}</span>
          <span className="inline-block mx-3 sm:mx-6 font-serif italic text-[#C8B89E] font-normal text-3xl sm:text-5xl md:text-6xl">
            &
          </span>
          <span>{couple.groom}</span>
        </motion.h1>

        {/* Full Formal Names */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif italic text-sm sm:text-base text-[#6B635B] mt-2 mb-8 tracking-wide"
        >
          {couple.brideFull} &amp; {couple.groomFull}
        </motion.p>

        {/* High-Impact Editorial Photo Frame with Subtle Border */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[3/4] rounded-2xl p-2 bg-white shadow-xl shadow-[#2D2926]/5 border border-[#E8E2D8]"
        >
          <div className="w-full h-full rounded-xl overflow-hidden relative group">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
              alt={`${couple.bride} and ${couple.groom}`}
              loading="eager"
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Soft editorial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

            {/* Bottom Photo Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-center text-white">
              <p className="font-serif text-base tracking-wider drop-shadow-sm">
                &ldquo;{couple.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Luxury Corner Ornaments */}
          <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#C8B89E]" />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#C8B89E]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#C8B89E]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#C8B89E]" />
        </motion.div>

        {/* Date and Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-[#2D2926]"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C8B89E]" />
            <span className="font-serif text-base tracking-wide font-medium">{couple.dateFormatted}</span>
          </div>
          <span className="hidden sm:inline text-[#C8B89E]">•</span>
          <div className="flex items-center gap-2 text-[#6B635B]">
            <MapPin className="w-4 h-4 text-[#C8B89E]" />
            <span className="tracking-wide">{venue.name}</span>
          </div>
        </motion.div>

        {/* Smooth Live Countdown Timer Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="mt-8 w-full max-w-md mx-auto"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#A38F70] mb-3 font-medium">
            Counting Down to Forever
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-2 rounded-xl bg-white/80 backdrop-blur-sm border border-[#E8E2D8] shadow-xs hover:border-[#C8B89E] transition-colors"
              >
                <span className="font-serif text-2xl sm:text-3xl font-light text-[#2D2926] leading-none">
                  {unit.value}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#6B635B] mt-1 font-medium">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Button: RSVP & Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#rsvp"
            className="px-8 py-3 rounded-full bg-[#2D2926] text-white font-sans text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-[#A38F70] transition-colors duration-300 shadow-md flex items-center gap-2 group"
          >
            <Heart className="w-3.5 h-3.5 text-[#C8B89E] fill-current group-hover:scale-110 transition-transform" />
            <span>RSVP Attendance</span>
          </a>
          <a
            href="#schedule"
            className="px-6 py-3 rounded-full bg-white/80 border border-[#E8E2D8] text-[#2D2926] font-sans text-xs sm:text-sm uppercase tracking-[0.15em] hover:border-[#C8B89E] hover:bg-white transition-colors duration-300 shadow-xs"
          >
            Event Details
          </a>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 mt-6 flex flex-col items-center text-[#A38F70]"
      >
        <span className="text-[10px] uppercase tracking-widest mb-1">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </header>
  );
}

