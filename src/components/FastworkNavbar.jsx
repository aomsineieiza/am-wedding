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
    { label: 'กำหนดการ', href: '#schedule' },
    { label: 'แกลเลอรี', href: '#gallery' },
    { label: 'ธีมสีแต่งกาย', href: '#dress-code' },
    { label: 'สถานที่', href: '#location' },
    { label: 'อวยพร', href: '#guestbook' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 transition-all duration-300 pointer-events-none flex justify-center px-3 sm:px-4 py-2.5 sm:py-4 w-full max-w-[100vw]">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-2 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? 'w-full max-w-4xl bg-[#FAFAFB]/92 backdrop-blur-xl border border-[#E2E5E9] shadow-lg shadow-slate-900/5 rounded-full px-3 sm:px-6 py-2'
            : 'w-full max-w-5xl bg-[#FAFAFB]/82 backdrop-blur-md border border-[#E4E7EB] rounded-full px-3 sm:px-6 py-2.5'
        }`}
      >
        {/* Brand / Monogram (Minimalist Korean Card Style) */}
        <a href="#" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#27272A] text-[#FAFAFB] flex items-center justify-center font-medium text-[10px] sm:text-xs tracking-wider shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
            {couple.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-xs sm:text-sm text-[#27272A] tracking-[0.18em] uppercase leading-none truncate">
              {couple.bride} <span className="text-[10px] mx-0.5">♥</span> {couple.groom}
            </span>
            <span className="text-[10px] text-[#71717A] font-normal tracking-wider leading-tight mt-0.5 truncate">
              23 . 01 . 2027
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#52525B] hover:text-[#27272A] hover:bg-[#EFF1F3] transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Ambient Sound Toggle */}
          <button
            type="button"
            onClick={handleAudioToggle}
            aria-label="Toggle ambient music"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
              isPlaying
                ? 'bg-[#E6F0F3] text-[#4A7888] border-[#BFD8DF]'
                : 'bg-[#EFF1F3] text-[#52525B] border-[#E2E5E9] hover:bg-[#E4E7EA]'
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#27272A] hover:bg-[#18181B] text-[#FAFAFB] text-[11px] sm:text-xs font-medium tracking-wider shadow-2xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-[#E5B5BC] shrink-0" />
            <span>RSVP ตอบรับ</span>
          </a>
        </div>
      </div>
    </header>
  );
}

