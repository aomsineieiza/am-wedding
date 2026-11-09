import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Footer() {
  const { couple } = weddingData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 bg-[#2D2926] text-[#FAF8F5] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Monogram emblem */}
        <div className="w-12 h-12 rounded-full border border-[#C8B89E]/40 flex items-center justify-center p-1 mb-6">
          <span className="font-serif text-lg tracking-widest text-[#C8B89E]">
            {couple.initials}
          </span>
        </div>

        {/* Couple Names */}
        <h3 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white mb-2">
          {couple.bride} &amp; {couple.groom}
        </h3>

        {/* Wedding Date */}
        <p className="text-xs uppercase tracking-[0.25em] text-[#C8B89E] font-medium mb-6">
          {couple.dateFormatted}
        </p>

        {/* Official Hashtag Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-mono tracking-wider text-white mb-8">
          <span>{couple.hashtag}</span>
        </div>

        {/* Back to top button */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[#C8B89E] transition-colors mb-10"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Copyright & Appreciation */}
        <div className="text-[11px] text-white/50 space-y-1 font-light tracking-wider">
          <p className="flex items-center justify-center gap-1.5">
            Crafted with <Heart className="w-3 h-3 text-[#C8B89E] fill-current" /> for family &amp; friends
          </p>
          <p>&copy; {new Date().getFullYear()} {couple.bride} &amp; {couple.groom}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

