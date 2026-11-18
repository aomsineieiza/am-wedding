import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Heart, Sun, Moon, Globe } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { weddingAudio } from '../utils/audioPlayer';
import { useLanguage } from '../context/LanguageContext';

export default function FastworkNavbar({ isDark = false, onToggleDark }) {
  const { lang, toggleLang, t } = useLanguage();
  const { couple } = weddingData;
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 40;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const handleAudioToggle = () => {
    weddingAudio.toggle();
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: t('nav.schedule', 'กำหนดการ'), href: '#schedule' },
    { label: t('nav.dressCode', 'ธีมสีแต่งกาย'), href: '#dress-code' },
    { label: t('nav.gallery', 'แกลเลอรี'), href: '#gallery' },
    { label: t('nav.album', 'อัลบั้ม'), href: '#album' },
    { label: t('nav.location', 'สถานที่'), href: '#location' },
  ];

  return (
    <header style={{ transform: 'translateZ(0)' }} className="fixed top-0 inset-x-0 z-40 transition-all duration-300 pointer-events-none flex justify-center px-3 sm:px-4 py-2.5 sm:py-4 w-full max-w-[100vw]">
      <div
        className={`pointer-events-auto flex items-center justify-between gap-2 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? 'w-full max-w-4xl bg-white/70 dark:bg-[#16191F]/70 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.08)] rounded-full px-3 sm:px-6 py-2'
            : 'w-full max-w-5xl bg-white/55 dark:bg-[#16191F]/55 backdrop-blur-xl backdrop-saturate-150 border border-white/50 dark:border-white/10 shadow-[0_4px_24px_rgb(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_24px_rgb(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.06)] rounded-full px-3 sm:px-6 py-2.5'
        }`}
      >
        {/* Brand / Logo */}
        <a href="#" className="flex items-center group min-w-0">
          <span className="font-bold text-sm sm:text-base text-[#27272A] dark:text-zinc-100 tracking-tight group-hover:text-[#0074E2] dark:group-hover:text-[#38BDF8] transition-colors">
            AMWedding
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#52525B] dark:text-zinc-300 hover:text-[#27272A] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher (TH / EN) */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={`Switch to ${lang === 'th' ? 'English' : 'Thai'}`}
            title={lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            className="h-8 px-2.5 rounded-full flex items-center justify-center gap-1 border transition-all cursor-pointer shrink-0 bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm text-[#27272A] dark:text-[#E4E4E7] border-black/[0.06] dark:border-white/[0.1] hover:bg-white/90 dark:hover:bg-white/[0.12] text-[11px] sm:text-xs font-bold tracking-wider shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#0074E2] dark:text-[#38BDF8]" />
            <span>{lang === 'th' ? 'EN' : 'TH'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? t('nav.lightMode', 'โหมดสว่าง') : t('nav.darkMode', 'โหมดมืด')}
            className="w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm text-[#52525B] dark:text-[#E4E4E7] border-black/[0.06] dark:border-white/[0.1] hover:bg-white/90 dark:hover:bg-white/[0.12] shadow-2xs"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Ambient Sound Toggle */}
          <button
            type="button"
            onClick={handleAudioToggle}
            aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
            title={
              weddingData.music
                ? `${isPlaying ? t('nav.nowPlaying', 'กำลังเล่น') : t('nav.playMusic', 'เล่นเพลง')}: ${weddingData.music.title} - ${weddingData.music.artist}`
                : t('nav.audioTitle', 'เปิด/ปิดเพลงประกอบ')
            }
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 backdrop-blur-sm shadow-2xs ${
              isPlaying
                ? 'bg-[#E6F0F3]/80 dark:bg-[#233542]/80 text-[#4A7888] dark:text-[#94AFC4] border-[#BFD8DF] dark:border-[#3A5568]'
                : 'bg-white/60 dark:bg-white/[0.06] text-[#52525B] dark:text-[#E4E4E7] border-black/[0.06] dark:border-white/[0.1] hover:bg-white/90 dark:hover:bg-white/[0.12]'
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Primary RSVP CTA Button (Desktop only, mobile has bottom MobileNav) */}
          <a
            href="#rsvp"
            onClick={(e) => handleNavClick(e, '#rsvp')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#27272A] dark:bg-[#94AFC4] hover:bg-[#18181B] dark:hover:bg-[#A6BFD2] text-[#FAFAFB] dark:text-[#141619] text-[11px] sm:text-xs font-medium tracking-wider shadow-2xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-[#C5E0E8] dark:text-[#141619] shrink-0" />
            <span>{t('nav.rsvp', 'RSVP ตอบรับ')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

