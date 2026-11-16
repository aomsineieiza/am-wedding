import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

// Procedural Whisper-Soft Paper Page Turn Sound (Web Audio API)
const playPageTurnSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const bufferSize = Math.floor(ctx.sampleRate * 0.13); // 130ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Exponentially decaying pink/white noise for realistic paper friction
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const decay = Math.exp(-progress * 5.8);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.13);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Fallback silently if audio context is blocked
  }
};

export default function WeddingAlbum() {
  const { lang, t } = useLanguage();
  const { couple } = weddingData;

  // 6 Sheets = 12 Individual Pages in total
  const TOTAL_SHEETS = 6;
  const TOTAL_PAGES = 12;

  // Responsive Mode: Mobile (< 768px) is strictly Single-Page; Desktop (>= 768px) is strictly 3D Double-Page
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const effectiveMode = isMobile ? 'single' : 'double';

  // Single page index for mobile magazine mode (1 to 12)
  const [singlePage, setSinglePage] = useState(1);
  const [singlePageDirection, setSinglePageDirection] = useState(1); // 1 = forward, -1 = backward

  // Track which sheet index is currently flipped (0 = cover is open or closed) for 3D flipbook
  const [flippedCount, setFlippedCount] = useState(1);
  const [flippingSheetIndex, setFlippingSheetIndex] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenDialogRef = useRef(null);

  // Auto-detect viewport on load and window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map 1-based page number to sheet index and front/back side
  const getSheetAndSide = (pageNum) => {
    const safePage = Math.max(1, Math.min(TOTAL_PAGES, pageNum));
    const sheetIdx = Math.floor((safePage - 1) / 2);
    const isFront = (safePage - 1) % 2 === 0;
    return { sheetIdx, isFront };
  };

  // Turn to specific single page on mobile
  const goToSinglePage = (pageNum, dir = 1) => {
    if (pageNum < 1 || pageNum > TOTAL_PAGES || pageNum === singlePage) return;
    playPageTurnSound();
    setSinglePageDirection(dir);
    setSinglePage(pageNum);
    // Keep 2-page flippedCount in sync
    const targetSheet = pageNum === 1 ? 0 : Math.ceil((pageNum - 1) / 2);
    setFlippedCount(targetSheet);
  };

  // Flip forward (3D book or single page)
  const flipNext = () => {
    if (effectiveMode === 'single') {
      goToSinglePage(singlePage + 1, 1);
      return;
    }
    if (flippedCount < TOTAL_SHEETS) {
      playPageTurnSound();
      setFlippingSheetIndex(flippedCount);
      const nextCount = flippedCount + 1;
      setFlippedCount(nextCount);
      setSinglePage(Math.min(TOTAL_PAGES, nextCount * 2));
      setTimeout(() => setFlippingSheetIndex(null), 800);
    }
  };

  // Flip backward (3D book or single page)
  const flipPrev = () => {
    if (effectiveMode === 'single') {
      goToSinglePage(singlePage - 1, -1);
      return;
    }
    if (flippedCount > 0) {
      playPageTurnSound();
      const prevSheet = flippedCount - 1;
      setFlippingSheetIndex(prevSheet);
      setFlippedCount(prevSheet);
      setSinglePage(prevSheet === 0 ? 1 : prevSheet * 2);
      setTimeout(() => setFlippingSheetIndex(null), 800);
    }
  };

  // Jump directly to a specific spread
  const jumpToSheet = (targetCount) => {
    if (targetCount === flippedCount) return;
    playPageTurnSound();
    setFlippedCount(targetCount);
    setSinglePage(targetCount === 0 ? 1 : targetCount * 2);
  };

  // Reset to cover / first page
  const resetToCover = () => {
    playPageTurnSound();
    setFlippedCount(0);
    setSinglePage(1);
    setSinglePageDirection(-1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') flipNext();
      if (e.key === 'ArrowLeft') flipPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [effectiveMode, singlePage, flippedCount]);

  // Touch swipe handling
  const touchStartXRef = useRef(0);
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) flipNext();
      else flipPrev();
    }
  };

  // Fullscreen Dialog controls
  const openFullscreen = () => {
    setIsFullscreen(true);
    if (fullscreenDialogRef.current) {
      fullscreenDialogRef.current.showModal();
    }
  };

  const closeFullscreen = () => {
    if (fullscreenDialogRef.current) {
      fullscreenDialogRef.current.close();
    }
    setIsFullscreen(false);
  };

  // Navigation chapter tabs
  const chapters = [
    { label: 'หน้าปก', labelEn: 'Cover', sheetCount: 0, singlePage: 1 },
    { label: 'ประวัติบ่าวสาว', labelEn: 'Profiles', sheetCount: 1, singlePage: 3 },
    { label: 'วัยเรียน', labelEn: 'Youth', sheetCount: 2, singlePage: 5 },
    { label: 'ชีวิตประจำวัน', labelEn: 'Daily Life', sheetCount: 3, singlePage: 7 },
    { label: 'สูท & มินิเดรส', labelEn: 'Romance', sheetCount: 4, singlePage: 9 },
    { label: 'ทุ่งหญ้า & ขอบคุณ', labelEn: 'Thanks', sheetCount: 5, singlePage: 11 },
  ];

  // Active chapter index calculation for tabs
  const activeChapterIdx = chapters.findIndex((ch, idx) => {
    const nextCh = chapters[idx + 1];
    if (!nextCh) return true;
    return effectiveMode === 'single'
      ? singlePage >= ch.singlePage && singlePage < nextCh.singlePage
      : flippedCount === ch.sheetCount;
  });

  /* ===============================================================
     SHEET FACES DEFINITION (12 INDIVIDUAL PAGES ACROSS 6 SHEETS)
     Colors: Muted White (#F5F6F8 / #F8F9FA), Neutral Border (#E2E4E8),
     Charcoal (#111317), Slate Gray (#64748B)
     =============================================================== */

  // Helper renderer for each page face
  const renderPageFace = (sheetIndex, isFront) => {
    // -------------------------------------------------------------
    // SHEET 0
    // Front: Iconic Front Cover ("the wedding")
    // Back: Inside Preface / Title Page
    // -------------------------------------------------------------
    if (sheetIndex === 0 && isFront) {
      // FRONT COVER
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-10 text-[#111317] relative bg-[#F5F6F8] overflow-hidden select-none border-l border-[#DFE2E6]">
          {/* Vertical Editorial Title Running Down Left Edge */}
          <div
            className="absolute left-2 sm:left-4 top-8 sm:top-12 font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111317] tracking-[0.08em] pointer-events-none origin-top-left -rotate-90 translate-y-44 sm:translate-y-56 whitespace-nowrap opacity-90"
            style={{ fontStyle: 'italic' }}
          >
            the wedding
          </div>

          <div className="flex items-center justify-end text-[10px] tracking-[0.25em] text-[#64748B] uppercase pl-10">
            <span>SPECIAL ISSUE • NO. 01</span>
          </div>

          {/* Main Cover Photo in Japanese Minimalist Frame */}
          <div className="my-auto flex-1 flex flex-col justify-center pl-6 sm:pl-9 pr-1 sm:pr-3 py-2">
            <div className="bg-white p-2.5 sm:p-3 shadow-md border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[3/3.8] sm:aspect-[3/4] w-full overflow-hidden bg-slate-100 relative">
                <img
                  src="/images/album/album-1.jpg"
                  alt="Aomsin & Mild Wedding Rings"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-left">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-white/80">
                    두 사람의 새로운 시작을 축복하며
                  </span>
                  <p className="font-serif text-xs sm:text-sm font-medium">A Lifetime Promise</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Title & Details */}
          <div className="pl-6 sm:pl-9 pr-1 sm:pr-3 text-center sm:text-right pt-2 pb-1">
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-[#111317] tracking-tight">
              {couple.groom} &amp; {couple.bride}
            </h3>
            <div className="text-[10px] sm:text-[11px] font-sans text-[#64748B] tracking-wider mt-0.5 uppercase">
              Saturday, January 23, 2027
            </div>
          </div>
        </div>
      );
    }

    if (sheetIndex === 0 && !isFront) {
      // INSIDE PREFACE (BACK OF SHEET 0)
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-5 sm:p-8 lg:p-11 text-[#111317] relative bg-[#F8F9FA] select-none border-r border-[#DFE2E6]">
          <div className="absolute inset-3 sm:inset-6 border border-[#E2E4E8] pointer-events-none" />

          <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-[#64748B] uppercase">
            <span>EDITORIAL ZINE</span>
            <span className="font-serif italic text-slate-500">Vol. 01</span>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-center text-center space-y-4 px-3 py-4">
            <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#717784] uppercase block">
              WEDDING PHOTOBOOK
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111317] tracking-tight leading-tight">
              {couple.groom} &amp; {couple.bride}
            </h3>

            <div className="w-10 h-px bg-[#CBD0D8] mx-auto my-2" />

            <p className="text-xs sm:text-sm font-serif italic text-[#4B515B] max-w-xs mx-auto leading-relaxed">
              &ldquo;When two people are meant for each other, no time is too long, no distance is too far.&rdquo;
            </p>

            <div className="text-[11px] font-sans text-[#64748B] tracking-widest pt-2 uppercase">
              <span>January 23, 2027</span>
              <span className="mx-2">•</span>
              <span>Le Pasiri, Nonthaburi</span>
            </div>
          </div>

          <div className="flex items-end justify-between text-[11px] text-[#949AA5] pt-3 pb-1">
            <span className="font-mono tracking-tighter">PAGE 01</span>
            <span className="font-serif italic font-bold text-base text-[#333740]">A &amp; M</span>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // SHEET 1
    // Front: Profile Page (Groom Aomsin & Bride Mild)
    // Back: Vows & Wedding Cake Celebration
    // -------------------------------------------------------------
    if (sheetIndex === 1 && isFront) {
      // PROFILES (EXPANDED TO FILL FULL HEIGHT ON MOBILE)
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-[#111317] relative bg-[#F8F9FA] select-none border-l border-[#DFE2E6]">
          <div className="flex items-center justify-between border-b border-[#E2E4E8] pb-2">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg sm:text-xl font-light italic text-[#111317]">
                profile
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#717784] uppercase font-sans">
                GET TO KNOW THE COUPLE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#949AA5]">02</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 my-auto flex-1 items-center py-2 sm:py-3">
            {/* Groom Profile */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 sm:w-36 lg:w-38 h-48 sm:h-54 lg:h-58 rounded-t-full rounded-b-md overflow-hidden bg-[#ECEEF2] border-2 border-[#E2E4E8] shadow-sm mb-2">
                <img
                  src="/images/album/groom-profile.jpg"
                  alt="Aomsin Groom"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#0074E2] uppercase">
                GROOM
              </span>
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#111317] mt-0.5">
                Aomsin (ออมสิน)
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#4B515B] mt-1 leading-snug italic max-w-[155px]">
                &ldquo;สัญญาว่าจะดูแลและรักมายด์ตลอดไปในทุกๆ วัน&rdquo;
              </p>
              <div className="mt-2 text-[9px] sm:text-[10px] text-[#64748B] space-y-0.5 font-mono">
                <div>BIRTH : MAR 1</div>
                <div>ROLE : Android Developer</div>
              </div>
            </div>

            {/* Bride Profile */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 sm:w-36 lg:w-38 h-48 sm:h-54 lg:h-58 rounded-t-full rounded-b-md overflow-hidden bg-[#ECEEF2] border-2 border-[#E2E4E8] shadow-sm mb-2">
                <img
                  src="/images/album/bride-profile.jpg"
                  alt="Mild Bride"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#E06D53] uppercase">
                BRIDE
              </span>
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#111317] mt-0.5">
                Mild (มายด์)
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#4B515B] mt-1 leading-snug italic max-w-[155px]">
                &ldquo;ขอบคุณที่จับมือและเป็นความสุขให้ออมสินเสมอมา&rdquo;
              </p>
              <div className="mt-2 text-[9px] sm:text-[10px] text-[#64748B] space-y-0.5 font-mono">
                <div>BIRTH : JAN 2</div>
                <div>ROLE : UXUI Designer</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#8C93A0] font-serif italic border-t border-[#E2E4E8] pt-2 pb-0.5">
            Aomsin &amp; Mild Wedding Story
          </div>
        </div>
      );
    }

    if (sheetIndex === 1 && !isFront) {
      // VOWS & CAKE
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-[#111317] relative bg-[#F8F9FA] select-none border-r border-[#DFE2E6]">
          <div className="flex items-center justify-between border-b border-[#E2E4E8] pb-2">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg sm:text-xl font-light italic text-[#111317]">
                our vows
              </span>
              <span className="text-[9px] tracking-[0.2em] text-[#717784] uppercase font-sans">
                SWEET CELEBRATION
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#949AA5]">03</span>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-center py-2 space-y-3">
            <div className="bg-white p-2.5 shadow-sm border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[4/3.8] sm:aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/album/album-4.jpg"
                  alt="Wedding Cake Celebration"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="text-center px-3 space-y-1.5 pt-1">
              <p className="font-serif text-xs sm:text-sm italic text-[#333740] leading-relaxed">
                &ldquo;서로가 운명이라면, 어떤 시간도 너무 길지 않고 어떤 거리도 멀지 않습니다.&rdquo;
              </p>
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#EBF4FE] text-[#0074E2] text-[10px] font-semibold tracking-wider uppercase border border-[#C4DDFB]">
                We&apos;re getting married!
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#717784] font-mono border-t border-[#E2E4E8] pt-2 pb-0.5">
            달콤한 사랑의 서약과 영원한 약속
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // SHEET 2
    // Front: School Days Chairs (album-2)
    // Back: School Days Playful Shopping Cart & Cafe (album-11)
    // -------------------------------------------------------------
    if (sheetIndex === 2 && isFront) {
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 text-[#111317] relative bg-[#F8F9FA] select-none border-l border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] tracking-[0.2em] uppercase pb-2 border-b border-[#E2E4E8]">
            <span className="font-serif italic font-normal text-xs text-[#111317]">chapter 01</span>
            <span className="text-[9px] font-mono">청춘의 달콤한 추억</span>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-center py-2">
            <div className="bg-white p-2.5 sm:p-3 shadow-sm border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[4/4.8] sm:aspect-[3/4] w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/album/album-2.jpg"
                  alt="Where It All Began"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <div className="mt-2.5 text-left">
              <h4 className="font-serif text-sm sm:text-base font-medium text-[#111317]">
                Where It All Began
              </h4>
              <p className="text-[11px] text-[#555B66] mt-0.5 font-light leading-relaxed">
                교실에서 처음 마주친 그날부터, 서로에게 영원을 약속하기까지.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end text-[10px] text-[#949AA5] pt-2 border-t border-[#E2E4E8] font-mono">
            <span>- 04 -</span>
          </div>
        </div>
      );
    }

    if (sheetIndex === 2 && !isFront) {
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 text-[#111317] relative bg-[#F8F9FA] select-none border-r border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] tracking-[0.2em] uppercase pb-2 border-b border-[#E2E4E8]">
            <span className="font-serif italic font-normal text-xs text-[#111317]">playful days</span>
            <span className="text-[9px] font-mono">언제나 미소로 함께하는 날들</span>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-center py-2">
            <div className="bg-white p-2.5 sm:p-3 shadow-sm border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[4/4.8] sm:aspect-[3/4] w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/album/album-11.jpg"
                  alt="Smile With You"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <div className="mt-2.5 text-left">
              <h4 className="font-serif text-sm sm:text-base font-medium text-[#111317]">
                Smile With You
              </h4>
              <p className="text-[11px] text-[#555B66] mt-0.5 font-light leading-relaxed">
                너와 함께하는 모든 평범한 날들이 가장 특별한 순간이 되었어.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end text-[10px] text-[#949AA5] pt-2 border-t border-[#E2E4E8] font-mono">
            <span>- 05 -</span>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // SHEET 3
    // Front: Kitchen Cooking (album-10)
    // Back: Cozy Bedroom & Balloons (album-13 & album-5)
    // -------------------------------------------------------------
    if (sheetIndex === 3 && isFront) {
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 text-[#111317] relative bg-[#F8F9FA] select-none border-l border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] tracking-[0.2em] uppercase pb-2 border-b border-[#E2E4E8]">
            <span className="font-serif italic font-normal text-xs text-[#111317]">chapter 02</span>
            <span className="text-[9px] font-mono">두 사람의 따뜻한 식탁</span>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-center py-2">
            <div className="bg-white p-2.5 sm:p-3 shadow-sm border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[4/4.8] sm:aspect-[3/4] w-full overflow-hidden bg-slate-100">
                <img
                  src="/images/album/album-10.jpg"
                  alt="Sweet Kitchen Recipes"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <div className="mt-2.5 text-left">
              <h4 className="font-serif text-sm sm:text-base font-medium text-[#111317]">
                Sweet Kitchen Recipes
              </h4>
              <p className="text-[11px] text-[#555B66] mt-0.5 font-light leading-relaxed">
                함께 요리하고 웃음을 나누며, 우리의 하루하루를 사랑으로 채워가요.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end text-[10px] text-[#949AA5] pt-2 border-t border-[#E2E4E8] font-mono">
            <span>- 06 -</span>
          </div>
        </div>
      );
    }

    if (sheetIndex === 3 && !isFront) {
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 text-[#111317] relative bg-[#F8F9FA] select-none border-r border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] tracking-[0.2em] uppercase pb-2 border-b border-[#E2E4E8]">
            <span className="font-serif italic font-normal text-xs text-[#111317]">cozy nights</span>
            <span className="text-[9px] font-mono">다정한 일상 속의 작은 행복</span>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-center py-2">
            <div className="bg-white p-2 sm:p-2.5 shadow-xs border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 rounded-xs">
                <img
                  src="/images/album/warmest-blanket.jpg"
                  alt="Warmest Blanket"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center hover:scale-103 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E4E8]">
            <h4 className="font-serif text-sm sm:text-base font-medium text-[#111317]">
              Warmest Blanket
            </h4>
            <p className="text-[11px] text-[#555B66] mt-0.5 font-light leading-relaxed">
              23.01 • 세상에서 가장 따뜻한 품에서 시작되는 우리의 이야기.
            </p>
            <div className="flex items-center justify-end text-[10px] text-[#949AA5] pt-1.5 font-mono">
              <span>- 07 -</span>
            </div>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // SHEET 4
    // Front: Veil & Ribbons (album-7 & album-8)
    // Back: Chic Sunglasses Editorial (album-3)
    // -------------------------------------------------------------
    if (sheetIndex === 4 && isFront) {
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 text-[#111317] relative bg-[#F8F9FA] select-none border-l border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] tracking-[0.2em] uppercase pb-2 border-b border-[#E2E4E8]">
            <span className="font-serif italic font-normal text-xs text-[#111317]">chapter 03</span>
            <span className="text-[9px] font-mono">베일 속 피어난 미소</span>
          </div>

          <div className="flex flex-col justify-center gap-2 sm:gap-2.5 my-auto flex-1 py-1 sm:py-2">
            <div className="bg-white p-1.5 sm:p-2 shadow-xs border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-slate-100 rounded-xs">
                <img
                  src="/images/album/album-7.jpg"
                  alt="Lifting Veil"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center hover:scale-103 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="bg-white p-1.5 sm:p-2 shadow-xs border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-slate-100 rounded-xs">
                <img
                  src="/images/album/album-8.jpg"
                  alt="Playful Blue Ribbons"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center hover:scale-103 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E4E8]">
            <h4 className="font-serif text-sm sm:text-base font-medium text-[#111317]">
              Under The Veil
            </h4>
            <p className="text-[11px] text-[#555B66] mt-0.5 font-light leading-relaxed">
              살며시 걷힌 베일 너머, 서로의 눈빛에 담긴 조용한 약속.
            </p>
            <div className="flex items-center justify-end text-[10px] text-[#949AA5] pt-1.5 font-mono">
              <span>- 08 -</span>
            </div>
          </div>
        </div>
      );
    }

    if (sheetIndex === 4 && !isFront) {
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 text-[#111317] relative bg-[#F8F9FA] select-none border-r border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] tracking-[0.2em] uppercase pb-2 border-b border-[#E2E4E8]">
            <span className="font-serif italic font-normal text-xs text-[#111317]">editorial chic</span>
            <span className="text-[9px] font-mono">우리만의 특별한 스타일</span>
          </div>

          <div className="my-auto flex-1 flex flex-col justify-center py-2">
            <div className="bg-white p-2 sm:p-2.5 shadow-sm border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[2/3] max-h-[48vh] sm:max-h-[54vh] w-full overflow-hidden bg-slate-100 rounded-xs mx-auto">
                <img
                  src="/images/album/editorial-chic.jpg"
                  alt="Chic & Unapologetic"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center hover:scale-103 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-2.5 text-left">
              <h4 className="font-serif text-sm sm:text-base font-medium text-[#111317]">
                Chic &amp; Unapologetic
              </h4>
              <p className="text-[11px] text-[#555B66] mt-0.5 font-light leading-relaxed">
                &ldquo;평범하지 않아도 좋아, 우리만의 방식으로 써 내려가는 사랑 이야기.&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end text-[10px] text-[#949AA5] pt-2 border-t border-[#E2E4E8] font-mono">
            <span>- 09 -</span>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // SHEET 5
    // Front: Outdoor Lawn & Balloons (album-6 & album-12)
    // Back: The Iconic Back Cover ("THANK YOU FOR COMING TODAY")
    // -------------------------------------------------------------
    if (sheetIndex === 5 && isFront) {
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-4 sm:p-7 lg:p-9 text-[#111317] relative bg-[#F8F9FA] select-none border-l border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] tracking-[0.2em] uppercase pb-2 border-b border-[#E2E4E8]">
            <span className="font-serif italic font-normal text-xs text-[#111317]">chapter 04</span>
            <span className="text-[9px] font-mono">푸른 하늘 아래 함께 달리며</span>
          </div>

          <div className="flex flex-col justify-center gap-2 sm:gap-2.5 my-auto flex-1 py-1 sm:py-2">
            <div className="bg-white p-1.5 sm:p-2 shadow-xs border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-slate-100 rounded-xs">
                <img
                  src="/images/album/album-6.jpg"
                  alt="Running On Lawn"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center hover:scale-103 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="bg-white p-1.5 sm:p-2 shadow-xs border border-[#E2E4E8] rounded-xs">
              <div className="aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-slate-100 rounded-xs">
                <img
                  src="/images/album/album-12.jpg"
                  alt="Lawn Balloons 2301"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center hover:scale-103 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E4E8]">
            <h4 className="font-serif text-sm sm:text-base font-medium text-[#111317]">
              Running Under The Sky
            </h4>
            <p className="text-[11px] text-[#555B66] mt-0.5 font-light leading-relaxed">
              너와 함께라면 넓은 푸른 들판도 가장 아늑한 우리 집이 돼.
            </p>
            <div className="flex items-center justify-end text-[10px] text-[#949AA5] pt-1.5 font-mono">
              <span>- 10 -</span>
            </div>
          </div>
        </div>
      );
    }

    if (sheetIndex === 5 && !isFront) {
      // THE ICONIC BACK COVER (MATCHES REFERENCE IMAGE)
      return (
        <div className="h-full flex-1 w-full flex flex-col justify-between p-5 sm:p-9 lg:p-11 text-[#111317] relative bg-[#F5F6F8] select-none border-r border-[#DFE2E6]">
          <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-[#64748B] uppercase border-b border-[#E2E4E8] pb-2 sm:pb-3">
            <span>GRATITUDE</span>
            <span>FINAL PAGE</span>
          </div>

          {/* Arched Photo Frame (rounded-t-full) */}
          <div className="my-auto flex-1 flex flex-col items-center justify-center text-center py-2">
            <div className="w-36 sm:w-44 lg:w-48 h-48 sm:h-56 lg:h-60 rounded-t-full rounded-b-md overflow-hidden bg-[#ECEEF2] border-2 border-[#E2E4E8] shadow-sm relative mb-3">
              <img
                src="/images/album/album-1.jpg"
                alt="Thank You All"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Title in Elegant Serif Caps */}
            <h3 className="font-serif text-base sm:text-lg lg:text-xl font-normal text-[#111317] tracking-wider uppercase">
              THANK YOU FOR COMING TODAY
            </h3>

            <p className="text-[10px] text-[#717784] font-sans mt-0.5 tracking-wider">
              함께해 주셔서 진심으로 감사드립니다
            </p>

            <div className="w-8 h-px bg-[#CBD0D8] my-2" />

            <p className="text-xs sm:text-sm text-[#475569] max-w-xs leading-relaxed font-sans font-light">
              ขอขอบคุณครอบครัว ญาติผู้ใหญ่ และเพื่อนพ้องทุกคนที่มาร่วมเป็นส่วนหนึ่งของวันสำคัญ และเป็นสักขีพยานในความรักของเราสองคน
            </p>

            <p className="text-[10px] text-[#64748B] max-w-xs mt-1.5 font-serif italic">
              &ldquo;저희의 특별한 날을 축복해 주신 모든 분들의 사랑과 마음에 진심으로 감사드립니다.&rdquo;
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] text-[#717784] border-t border-[#E2E4E8] pt-2 sm:pt-3 uppercase tracking-wider font-mono">
            <span>{couple.groom} &amp; {couple.bride}</span>
            <span>January 23, 2027</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="album" className="scroll-mt-24 py-10 sm:py-16 px-3 sm:px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-[11px] font-semibold tracking-wider uppercase mb-3 border border-[#C4DDFB]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('album.badge', 'WEDDING PHOTOBOOK • EDITORIAL MAGAZINE')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-zinc-100 tracking-tight"
          >
            {t('album.title', 'อัลบั้มภาพความทรงจำ')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-2 font-normal"
          >
            {t(
              'album.subtitle',
              'เปิดดูอัลบั้ม รวมเรื่องราวและภาพถ่ายทั้งหมดของเราสองคน'
            )}
          </motion.p>
        </div>

        {/* Tab Pills for Fast Chapter Navigation */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-none px-2">
          {chapters.map((ch, idx) => {
            const isActive = activeChapterIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (effectiveMode === 'single') {
                    goToSinglePage(ch.singlePage, ch.singlePage >= singlePage ? 1 : -1);
                  } else {
                    jumpToSheet(ch.sheetCount);
                  }
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${isActive
                  ? 'bg-[#0074E2] text-white shadow-sm shadow-blue-500/25 scale-102'
                  : 'bg-white/95 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/90 dark:border-zinc-700 hover:border-slate-300'
                  }`}
              >
                <span>
                  {idx + 1}. {lang === 'th' ? ch.label : ch.labelEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===============================================================
            MAIN ALBUM STAGE (ADAPTIVE: 1-PAGE MOBILE vs 2-PAGE 3D DESKTOP)
           =============================================================== */}
        <div className="relative mx-auto max-w-5xl" style={{ perspective: 2400 }}>
          {/* Main Book Shell with Layered Paper Thickness */}
          <div
            className="relative rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-900/20 border-2 border-[#E2E4E8] dark:border-zinc-700 overflow-hidden bg-[#F5F6F8]"
            style={{
              boxShadow:
                '0 32px 75px -15px rgba(15, 23, 42, 0.26), 0 12px 30px -8px rgba(15, 23, 42, 0.12)',
            }}
          >
            {/* Top Toolbar in Muted Neutral Tone */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#ECEEF2] border-b border-[#E2E4E8] text-xs text-[#555B66]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0074E2]" />
                <span className="font-serif italic font-medium hidden xs:inline">the wedding magazine</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#DFE2E6] text-[#333740] font-mono font-medium">
                  {effectiveMode === 'single'
                    ? `Page ${singlePage.toString().padStart(2, '0')} / ${TOTAL_PAGES}`
                    : flippedCount === 0
                      ? 'Cover'
                      : flippedCount === TOTAL_SHEETS
                        ? 'Back'
                        : `Page 0${flippedCount * 2} - 0${flippedCount * 2 + 1}`}
                </span>
              </div>

              {/* Center/Right Toolbar Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Reset to Cover Button */}
                <button
                  type="button"
                  onClick={resetToCover}
                  className="inline-flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#0074E2] transition-colors cursor-pointer px-1.5 py-0.5"
                  title="กลับสู่หน้าแรก"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden xs:inline">หน้าแรก</span>
                </button>

                {/* Fullscreen Modal Toggle Button */}
                <button
                  type="button"
                  onClick={openFullscreen}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-[#475569] hover:text-[#0074E2] hover:bg-white/80 transition-colors cursor-pointer"
                  aria-label="View Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('album.fullscreen', 'ดูเต็มจอ')}</span>
                </button>
              </div>
            </div>

            {/* ===============================================================
                CONTENT DISPLAY: EITHER SINGLE-PAGE MODE OR 3D DOUBLE-PAGE SPREAD
               =============================================================== */}
            {effectiveMode === 'single' ? (
              /* ===============================================================
                 MODE 1: SINGLE-PAGE MAGAZINE VIEW (OPTIMIZED FOR MOBILE UX)
                 Full-width portrait magazine layout, large crisp photos, swipeable
                 =============================================================== */
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative w-full max-w-md mx-auto min-h-[530px] sm:min-h-[580px] flex flex-col justify-between overflow-hidden bg-[#F8F9FA] select-none"
              >
                {/* Left Tap Zone for Quick Thumb Navigation */}
                <div
                  onClick={() => goToSinglePage(singlePage - 1, -1)}
                  className={`absolute inset-y-0 left-0 w-1/4 z-20 ${singlePage > 1 ? 'cursor-pointer active:bg-black/5' : 'pointer-events-none'
                    }`}
                  aria-label="Previous Page"
                />

                {/* Right Tap Zone for Quick Thumb Navigation */}
                <div
                  onClick={() => goToSinglePage(singlePage + 1, 1)}
                  className={`absolute inset-y-0 right-0 w-1/4 z-20 ${singlePage < TOTAL_PAGES ? 'cursor-pointer active:bg-black/5' : 'pointer-events-none'
                    }`}
                  aria-label="Next Page"
                />

                {/* Subtle Floating Navigation Edge Chevrons */}
                {singlePage > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSinglePage(singlePage - 1, -1);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-[#E2E4E8] shadow-md flex items-center justify-center text-slate-700 hover:text-[#0074E2] active:scale-90 transition-transform cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {singlePage < TOTAL_PAGES && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSinglePage(singlePage + 1, 1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-[#E2E4E8] shadow-md flex items-center justify-center text-slate-700 hover:text-[#0074E2] active:scale-90 transition-transform cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Active Page Face with Animated Slide/Turn */}
                <AnimatePresence mode="wait" custom={singlePageDirection}>
                  <motion.div
                    key={singlePage}
                    custom={singlePageDirection}
                    initial={{ opacity: 0, x: singlePageDirection * 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -singlePageDirection * 25 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    style={{ willChange: 'transform, opacity' }}
                    className="w-full flex-1 flex flex-col h-full"
                  >
                    {(() => {
                      const { sheetIdx, isFront } = getSheetAndSide(singlePage);
                      return renderPageFace(sheetIdx, isFront);
                    })()}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Controls Bar for Single-Page Mode */}
                <div className="flex items-center justify-between px-3 sm:px-6 py-3 bg-[#ECEEF2] border-t border-[#E2E4E8] z-20">
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={() => goToSinglePage(singlePage - 1, -1)}
                    disabled={singlePage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#E2E4E8] text-xs font-semibold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs hover:border-[#0074E2] hover:text-[#0074E2] active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[11px] font-medium">ก่อนหน้า</span>
                  </button>

                  {/* Progress Indicator */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono font-bold text-[#111317]">
                      {singlePage} / {TOTAL_PAGES}
                    </span>
                    <div className="w-20 sm:w-28 h-1 rounded-full bg-[#DFE2E6] overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#0074E2] transition-all duration-300"
                        style={{ width: `${(singlePage / TOTAL_PAGES) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => goToSinglePage(singlePage + 1, 1)}
                    disabled={singlePage === TOTAL_PAGES}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0074E2] text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs hover:bg-[#0060B8] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="text-[11px] font-medium">ถัดไป</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* ===============================================================
                 MODE 2: 3D REALISTIC MULTI-SHEET FLIPBOOK (DESKTOP & TABLET UX)
                 =============================================================== */
              <>
                <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  className="relative w-full min-h-[480px] sm:min-h-[580px] lg:min-h-[640px] overflow-hidden bg-[#ECEEF2]"
                  style={{ perspective: 2400 }}
                >
                  {/* Center Spine Crease Gradient Shadow */}
                  <div
                    className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 sm:w-14 pointer-events-none z-30"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.03) 60%, rgba(0,0,0,0.18) 100%)',
                    }}
                  >
                    <div className="w-px h-full mx-auto bg-black/10" />
                  </div>

                  {/* Left Stack Background (When sheets are flipped to the left) */}
                  <div
                    onClick={flipPrev}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to flip to previous page"
                    className={`absolute inset-y-0 left-0 w-1/2 z-0 bg-[#F8F9FA] group/left ${flippedCount > 0 ? 'cursor-pointer' : 'cursor-default'
                      }`}
                  >
                    <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                    {flippedCount > 0 && (
                      <div className="absolute top-4 left-4 z-40 opacity-0 group-hover/left:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-md">
                        <ArrowLeft className="w-3 h-3 text-[#0074E2]" />
                        <span>คลิกเพื่อพลิกกลับ</span>
                      </div>
                    )}
                  </div>

                  {/* Right Stack Background (When sheets are sitting on the right) */}
                  <div
                    onClick={flipNext}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to flip to next page"
                    className={`absolute inset-y-0 right-0 w-1/2 z-0 bg-[#F8F9FA] group/right ${flippedCount < TOTAL_SHEETS ? 'cursor-pointer' : 'cursor-default'
                      }`}
                  >
                    <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                    {flippedCount < TOTAL_SHEETS && (
                      <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/right:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-md">
                        <span>คลิกเพื่อเปิดหน้าถัดไป</span>
                        <ArrowRight className="w-3 h-3 text-[#0074E2]" />
                      </div>
                    )}
                  </div>

                  {/* 3D Multi-Sheet Leaves */}
                  {[...Array(TOTAL_SHEETS)].map((_, sheetIdx) => {
                    const isFlipped = sheetIdx < flippedCount;
                    const isFlipping = sheetIdx === flippingSheetIndex;
                    let zIndex = isFlipped ? sheetIdx + 1 : TOTAL_SHEETS - sheetIdx;
                    if (isFlipping) zIndex = TOTAL_SHEETS + 20;

                    return (
                      <div
                        key={sheetIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFlipped) flipPrev();
                          else flipNext();
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Sheet ${sheetIdx + 1}`}
                        className="absolute top-0 left-1/2 w-1/2 h-full cursor-pointer"
                        style={{
                          transformOrigin: 'left center',
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                          transition:
                            'transform 0.75s cubic-bezier(0.25, 1, 0.45, 1), z-index 0.75s step-end',
                          zIndex,
                        }}
                      >
                        {/* Front Face */}
                        <div
                          className="absolute inset-0 w-full h-full bg-[#F8F9FA] shadow-md border-r border-[#E2E4E8]"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
                          }}
                        >
                          {renderPageFace(sheetIdx, true)}
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none transition-opacity duration-500"
                            style={{
                              opacity: isFlipping && !isFlipped ? 0.35 : 0,
                            }}
                          />
                        </div>

                        {/* Back Face */}
                        <div
                          className="absolute inset-0 w-full h-full bg-[#F8F9FA] shadow-md border-l border-[#E2E4E8]"
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          {renderPageFace(sheetIdx, false)}
                          <div
                            className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-transparent pointer-events-none transition-opacity duration-500"
                            style={{
                              opacity: isFlipping && isFlipped ? 0.35 : 0,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Book Controls Bar for Double-Page Mode */}
                <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#ECEEF2] border-t border-[#E2E4E8]">
                  <button
                    type="button"
                    onClick={flipPrev}
                    disabled={flippedCount === 0}
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-[#0074E2] hover:border-[#0074E2] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('album.prevPage', 'หน้าก่อนหน้า')}</span>
                  </button>

                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[...Array(TOTAL_SHEETS + 1)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => jumpToSheet(i)}
                        aria-label={`Jump to page ${i}`}
                        className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${flippedCount === i
                          ? 'w-6 sm:w-8 bg-[#0074E2]'
                          : 'w-2 sm:w-2.5 bg-slate-300 dark:bg-zinc-600 hover:bg-slate-400'
                          }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={flipNext}
                    disabled={flippedCount === TOTAL_SHEETS}
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#0074E2] text-white text-xs font-semibold hover:bg-[#0060B8] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    <span className="hidden sm:inline">{t('album.nextPage', 'หน้าถัดไป')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Helper Note */}
          <div className="text-center text-xs text-slate-500 dark:text-zinc-400 mt-4 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0074E2]" />
            <span>
              {effectiveMode === 'single'
                ? 'ปัดซ้าย-ขวา หรือแตะขอบข้างเพื่อเปิดหน้าถัดไป • Swipe left/right or tap edges to turn page'
                : 'คลิกที่หน้าหนังสือฝั่งขวาเพื่อเปิดไปข้างหน้า หรือคลิกฝั่งซ้ายเพื่อพลิกกลับ • Click book to flip'}
            </span>
          </div>
        </div>
      </div>

      {/* ===============================================================
          FULLSCREEN READING DIALOG (Native HTML <dialog>)
         =============================================================== */}
      <dialog
        ref={fullscreenDialogRef}
        closedby="any"
        onCancel={closeFullscreen}
        className="backdrop:bg-black/85 backdrop:backdrop-blur-md rounded-2xl sm:rounded-3xl p-0 max-w-6xl w-[95vw] max-h-[92vh] bg-[#F5F6F8] text-slate-900 border border-[#E2E4E8] shadow-2xl overflow-hidden m-auto"
      >
        <div className="flex flex-col h-full max-h-[92vh]">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#ECEEF2] border-b border-[#E2E4E8]">
            <div className="flex items-center gap-2">
              <span className="font-serif italic font-medium text-sm">the wedding magazine</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-slate-700 font-mono font-medium">
                {effectiveMode === 'single'
                  ? `Page ${singlePage} / ${TOTAL_PAGES}`
                  : flippedCount === 0
                    ? 'Cover'
                    : flippedCount === TOTAL_SHEETS
                      ? 'Back'
                      : `0${flippedCount * 2} / 0${flippedCount * 2 + 1}`}
              </span>
            </div>
            <button
              type="button"
              onClick={closeFullscreen}
              className="p-1.5 rounded-full hover:bg-slate-200/80 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close Fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Stage (Adaptive: Single-Page on Mobile, 3D on Desktop) */}
          {effectiveMode === 'single' ? (
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex-1 overflow-y-auto p-2 sm:p-4 flex items-center justify-center bg-[#ECEEF2]"
            >
              <div className="relative w-full max-w-md min-h-[520px] rounded-xl border border-[#E2E4E8] overflow-hidden bg-[#F8F9FA] shadow-xl flex flex-col justify-between">
                {/* Active Page Face */}
                <AnimatePresence mode="wait" custom={singlePageDirection}>
                  <motion.div
                    key={singlePage}
                    custom={singlePageDirection}
                    initial={{ opacity: 0, x: singlePageDirection * 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -singlePageDirection * 25 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    style={{ willChange: 'transform, opacity' }}
                    className="w-full flex-1 flex flex-col h-full"
                  >
                    {(() => {
                      const { sheetIdx, isFront } = getSheetAndSide(singlePage);
                      return renderPageFace(sheetIdx, isFront);
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 overflow-hidden p-4 sm:p-6 flex items-center justify-center bg-[#ECEEF2]"
              style={{ perspective: 2400 }}
            >
              <div className="relative w-full max-w-4xl h-[480px] sm:h-[560px] rounded-xl border border-[#E2E4E8] overflow-hidden bg-[#ECEEF2] shadow-xl">
                {/* Spine Crease */}
                <div
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 pointer-events-none z-30"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.03) 60%, rgba(0,0,0,0.18) 100%)',
                  }}
                />

                {/* Left & Right Click Zones */}
                <div
                  onClick={flipPrev}
                  className="absolute inset-y-0 left-0 w-1/2 z-0 cursor-pointer bg-[#F8F9FA]"
                />
                <div
                  onClick={flipNext}
                  className="absolute inset-y-0 right-0 w-1/2 z-0 cursor-pointer bg-[#F8F9FA]"
                />

                {/* Sheets in Modal */}
                {[...Array(TOTAL_SHEETS)].map((_, sheetIdx) => {
                  const isFlipped = sheetIdx < flippedCount;
                  const isFlipping = sheetIdx === flippingSheetIndex;
                  let zIndex = isFlipped ? sheetIdx + 1 : TOTAL_SHEETS - sheetIdx;
                  if (isFlipping) zIndex = TOTAL_SHEETS + 20;

                  return (
                    <div
                      key={sheetIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFlipped) flipPrev();
                        else flipNext();
                      }}
                      className="absolute top-0 left-1/2 w-1/2 h-full cursor-pointer"
                      style={{
                        transformOrigin: 'left center',
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                        transition:
                          'transform 0.75s cubic-bezier(0.25, 1, 0.45, 1), z-index 0.75s step-end',
                        zIndex,
                      }}
                    >
                      <div
                        className="absolute inset-0 w-full h-full bg-[#F8F9FA] border-r border-[#E2E4E8]"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)',
                        }}
                      >
                        {renderPageFace(sheetIdx, true)}
                      </div>
                      <div
                        className="absolute inset-0 w-full h-full bg-[#F8F9FA] border-l border-[#E2E4E8]"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        {renderPageFace(sheetIdx, false)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#ECEEF2] border-t border-[#E2E4E8]">
            <button
              type="button"
              onClick={effectiveMode === 'single' ? () => goToSinglePage(singlePage - 1, -1) : flipPrev}
              disabled={effectiveMode === 'single' ? singlePage === 1 : flippedCount === 0}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0074E2] disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('album.prevPage', 'หน้าก่อนหน้า')}</span>
            </button>

            <span className="text-xs font-medium text-slate-600 font-mono">
              {effectiveMode === 'single' ? `${singlePage} / ${TOTAL_PAGES}` : 'Click left/right pages to turn'}
            </span>

            <button
              type="button"
              onClick={effectiveMode === 'single' ? () => goToSinglePage(singlePage + 1, 1) : flipNext}
              disabled={effectiveMode === 'single' ? singlePage === TOTAL_PAGES : flippedCount === TOTAL_SHEETS}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#0074E2] text-white text-xs font-semibold hover:bg-[#0060B8] disabled:opacity-30 cursor-pointer"
            >
              <span>{t('album.nextPage', 'หน้าถัดไป')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
