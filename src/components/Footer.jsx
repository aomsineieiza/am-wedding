import React from 'react';
import { ArrowUp, Heart, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();
  const { couple } = weddingData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 bg-[#27272A] text-[#D4D4D8] relative overflow-hidden pb-24 sm:pb-20 border-t border-[#E2E5E9]">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Monogram emblem */}
        <div className="w-12 h-12 rounded-full bg-[#FAFAFB] text-[#27272A] flex items-center justify-center font-bold text-xs tracking-wider shadow-md mb-5">
          {couple.groom[0]}♥{couple.bride[0]}
        </div>

        {/* Couple Names */}
        <h3 className="text-xl sm:text-2xl font-medium tracking-[0.25em] uppercase text-[#FAFAFB] mb-2">
          {couple.groom} <span className="text-sm mx-1">♥</span> {couple.bride}
        </h3>

        {/* Wedding Date */}
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#A1A1AA] font-medium mb-6">
          {lang === 'th' ? couple.thaiDateFormatted : couple.dateFormatted}
        </p>

        {/* Official Hashtag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium tracking-wider text-[#FAFAFB] mb-8">
          <span>{couple.hashtag}</span>
        </div>

        {/* Back to top button */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#D4D4D8] hover:text-[#27272A] hover:border-[#FAFAFB] hover:bg-[#FAFAFB] transition-all mb-10 cursor-pointer shadow-sm"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Copyright */}
        <div className="text-xs text-[#A1A1AA] space-y-1 font-light">
          <p className="flex items-center justify-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-[#E5B5BC] fill-current" /> for {couple.groom} &amp; {couple.bride}&apos;s Family &amp; Friends
          </p>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
