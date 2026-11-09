import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Heart, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { weddingAudio } from '../utils/audioPlayer';

export default function FastworkNavbar() {
  const { couple } = weddingData;
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const state = weddingAudio.toggle();
    setIsPlaying(state);
  };

  const navLinks = [
    { label: 'เรื่องราวของเรา', href: '#story' },
    { label: 'กำหนดการ', href: '#schedule' },
    { label: 'แกลเลอรี', href: '#gallery' },
    { label: 'ธีมสีแต่งกาย', href: '#dress-code' },
    { label: 'สถานที่', href: '#location' },
    { label: 'อวยพร', href: '#guestbook' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none flex justify-center px-4 py-3 sm:py-4">
      <div
        className={`pointer-events-auto flex items-center justify-between transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? 'w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-900/5 rounded-full px-4 sm:px-6 py-2.5'
            : 'w-full max-w-6xl bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-2xl px-4 sm:px-6 py-3'
        }`}
      >
        {/* Brand / Monogram */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#0074E2] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            {couple.initials}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs sm:text-sm text-slate-900 tracking-tight leading-none group-hover:text-[#0074E2] transition-colors">
              {couple.bride} &amp; {couple.groom}
            </span>
            <span className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
              Wedding Celebration
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-[#0074E2] hover:bg-slate-100/80 transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Fastwork-style Ambient Sound Toggle */}
          <button
            type="button"
            onClick={handleAudioToggle}
            aria-label="Toggle ambient music"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isPlaying
                ? 'bg-[#EBF4FE] text-[#0074E2] border-[#C4DDFB]'
                : 'bg-slate-100/80 text-slate-600 border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Primary RSVP CTA Button */}
          <a
            href="#rsvp"
            className="flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-white/90" />
            <span>RSVP ตอบรับ</span>
          </a>
        </div>
      </div>
    </header>
  );
}

