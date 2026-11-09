import React from 'react';
import { ArrowUp, Heart, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import RSVPAdminModal from './RSVPAdminModal';

export default function Footer() {
  const { couple } = weddingData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0F172A] text-slate-300 relative overflow-hidden pb-24 sm:pb-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Monogram emblem */}
        <div className="w-12 h-12 rounded-full bg-[#0074E2] text-white flex items-center justify-center font-bold text-sm shadow-md mb-5">
          {couple.initials}
        </div>

        {/* Couple Names */}
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {couple.bride} &amp; {couple.groom}
        </h3>

        {/* Wedding Date */}
        <p className="text-xs uppercase tracking-[0.25em] text-[#38BDF8] font-semibold mb-6">
          {couple.dateFormatted}
        </p>

        {/* Official Hashtag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-medium text-white mb-8">
          <span>{couple.hashtag}</span>
        </div>

        {/* Back to top button */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800/80 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#0074E2] hover:bg-[#0074E2] transition-all mb-10 cursor-pointer shadow-sm"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Copyright */}
        <div className="text-xs text-slate-400 space-y-1 font-light">
          <p className="flex items-center justify-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" /> for {couple.bride} &amp; {couple.groom}&apos;s Family &amp; Friends
          </p>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Discreet RSVP Admin Access */}
        <RSVPAdminModal />
      </div>
    </footer>
  );
}
