import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { weddingAudio } from '../utils/audioPlayer';

export default function EnvelopeIntro({ onOpen }) {
  const { couple, venue } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleScreenTap = () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      weddingAudio.play();
    } catch {
      // Audio fallback
    }

    // Flip top flap behind the sliding card once it passes 90deg
    setTimeout(() => {
      setFlapBehind(true);
    }, 240);

    // As soon as the card finishes sliding up, transition straight into the website
    setTimeout(() => {
      setIsExiting(true);
    }, 1150);

    setTimeout(() => {
      setIsOpen(true);
      if (onOpen) onOpen();
    }, 1650);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="powder-blue-showcase-envelope"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleScreenTap}
          className="fixed inset-0 z-50 w-screen h-dvh flex flex-col items-center justify-center p-4 sm:p-8 figjam-bg overflow-hidden select-none cursor-pointer"
        >
          {/* SVG Filters & Patterns (Suede Paper Grain + Polka Dot Text Fill) */}
          <svg className="sr-only" aria-hidden="true">
            <defs>
              <filter id="suede-paper-grain" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.065 0"
                />
              </filter>

              {/* Polka-dot pattern inside "Save the Date" display letters */}
              <pattern id="editorial-dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#1E1E1E" />
                <circle cx="2.5" cy="2.5" r="1.35" fill="#7A7A7A" />
                <circle cx="6.5" cy="6.5" r="1.35" fill="#5A5A5A" />
              </pattern>
            </defs>
          </svg>

          {/* Soft Ambient Studio Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] bg-[#BFD8DF]/30 rounded-full blur-3xl pointer-events-none" />

          {/* FigJam Board Top-Left Section Pill & Floating Cursor Tag */}
          <div className="relative z-30 pt-2 sm:pt-4 flex items-center justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-xs text-[11px] sm:text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#7A98B3]" />
              <span>{couple.bride} &amp; {couple.groom} — Wedding Invitation Board</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono">
                23.01.2027
              </span>
            </div>
          </div>

          {/* ===============================================================
              CENTER SHOWCASE ENVELOPE ASSEMBLY (Tilted like Reference Image)
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -3.5, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: isOpening ? 28 : 0,
              rotate: -3.5,
              scale: isExiting ? 1.12 : 1,
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[320px] sm:w-[440px] md:w-[480px] h-[235px] sm:h-[320px] md:h-[345px] my-auto z-20"
            style={{ perspective: 1400 }}
          >
            {/* 1. ENVELOPE INSIDE BACK LINING (Powder Blue Suede) */}
            <div
              className="absolute inset-0 rounded-[14px] shadow-2xl border border-[#A5C3CD]"
              style={{
                background: 'linear-gradient(165deg, #C7E0E8 0%, #B4D0D9 55%, #A3C1CC 100%)',
                boxShadow: '0 28px 60px -12px rgba(15, 23, 42, 0.22), 0 8px 20px -4px rgba(15, 23, 42, 0.1)',
              }}
            >
              {/* Inner recessed border */}
              <div className="absolute inset-3 rounded-[10px] border border-white/35 bg-[#B8D4DD]/50" />
            </div>

            {/* 2. TOP POINTED TRIANGULAR FLAP (Flips open upward like Reference Image) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isOpening ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
              }}
              className={`absolute inset-x-0 top-0 h-[62%] pointer-events-none ${
                flapBehind ? 'z-[5]' : 'z-[35]'
              }`}
            >
              {/* Front of Top Flap (Visible when closed) */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: 'hidden',
                  filter: 'drop-shadow(0 6px 10px rgba(15, 23, 42, 0.12))',
                }}
              >
                <svg viewBox="0 0 400 220" preserveAspectRatio="none" className="w-full h-full">
                  <path
                    d="M 0,0 L 400,0 L 218,198 Q 200,214 182,198 Z"
                    fill="#CAE2EA"
                    stroke="#AECAD4"
                    strokeWidth="2"
                  />
                  <path
                    d="M 18,6 L 382,6 L 212,184 Q 200,196 188,184 Z"
                    fill="none"
                    stroke="#DCEEF4"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Back of Top Flap (Visible sticking up behind the card when opened!) */}
              <div
                className="absolute inset-0"
                style={{
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                  filter: 'drop-shadow(0 -6px 14px rgba(15, 23, 42, 0.1))',
                }}
              >
                <svg viewBox="0 0 400 220" preserveAspectRatio="none" className="w-full h-full">
                  <path
                    d="M 0,0 L 400,0 L 218,198 Q 200,214 182,198 Z"
                    fill="#C2DCE5"
                    stroke="#A7C4CE"
                    strokeWidth="2"
                  />
                  {/* Inner Embossed Triangle Peak Lines (Matches Reference Top Flap) */}
                  <path
                    d="M 28,0 L 372,0 L 212,172 Q 200,185 188,172 Z"
                    fill="#B9D5DF"
                    stroke="#D5E9F0"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </motion.div>

            {/* 3. WHITE EDITORIAL SHOWCASE CARD (Slides up out of envelope) */}
            <motion.div
              initial={{ y: 0, rotate: 0, scale: 0.96, opacity: 0.96 }}
              animate={
                isOpening
                  ? { y: -112, rotate: 2.2, scale: 1, opacity: 1 }
                  : { y: -14, rotate: 0.8, scale: 0.96, opacity: 0.98 }
              }
              transition={{
                duration: 0.85,
                delay: isOpening ? 0.22 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="envelope-paper-card absolute inset-x-4 sm:inset-x-6 top-2 h-[220px] sm:h-[295px] md:h-[315px] bg-white shadow-xl border border-slate-200/90 flex flex-col justify-between py-3 sm:py-5 px-4 sm:px-7 text-center z-20"
            >
              {/* Top Repeating Script ★ Star Marquee Row */}
              <div className="w-full overflow-hidden whitespace-nowrap text-[11px] sm:text-[13px] text-slate-800 tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 border-b border-slate-100 pb-1.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <React.Fragment key={`top-marquee-${idx}`}>
                    <span className="font-calligraphy text-base sm:text-xl leading-none text-slate-900">
                      aomsin &amp; mild
                    </span>
                    {idx < 4 && <span className="text-[8px] sm:text-[9px] text-slate-900">★</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Editorial Outlined Serif Header & Date */}
              <div className="my-auto pt-1">
                <p
                  className="font-editorial-serif text-[12px] sm:text-[17px] md:text-[19px] tracking-[0.06em] uppercase text-slate-900 font-semibold leading-tight"
                  style={{
                    WebkitTextStroke: '0.35px #1E293B',
                  }}
                >
                  AOMSIN &amp; MILD WEDDING SHOWCASE
                </p>
                <p className="font-editorial-serif text-[11px] sm:text-[14px] text-slate-600 tracking-wider mt-0.5">
                  2027.01.23 (Sat) 07:30 • {venue.name}
                </p>

                {/* Centerpiece Giant Tilted Editorial Serif ("Save the Date" / "Wedding Day") */}
                <div className="relative py-2 sm:py-3 flex flex-col items-center justify-center -rotate-[6deg]">
                  <svg
                    viewBox="0 0 360 115"
                    className="w-full max-w-[250px] sm:max-w-[330px] h-auto overflow-visible"
                  >
                    <text
                      x="175"
                      y="54"
                      textAnchor="middle"
                      fill="url(#editorial-dots)"
                      stroke="#18181B"
                      strokeWidth="1.1"
                      className="font-editorial-serif italic"
                      fontSize="58"
                      letterSpacing="1"
                    >
                      Save the
                    </text>
                    <text
                      x="190"
                      y="102"
                      textAnchor="middle"
                      fill="url(#editorial-dots)"
                      stroke="#18181B"
                      strokeWidth="1.1"
                      className="font-editorial-serif italic"
                      fontSize="58"
                      letterSpacing="2"
                    >
                      Date
                    </text>
                  </svg>
                </div>
              </div>

              {/* Bottom Repeating Script ★ Star Marquee Row */}
              <div className="w-full overflow-hidden whitespace-nowrap text-[11px] sm:text-[13px] text-slate-800 tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 border-t border-slate-100 pt-1.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <React.Fragment key={`bot-marquee-${idx}`}>
                    <span className="font-calligraphy text-base sm:text-xl leading-none text-slate-900">
                      aomsin &amp; mild
                    </span>
                    {idx < 4 && <span className="text-[8px] sm:text-[9px] text-slate-900">★</span>}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* 4. PERFORATED POSTAGE STAMP + PLASTIC BREAD-CLIP TAG (Right Corner) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: 6, x: 10, y: 10 }}
              animate={
                isOpening
                  ? { opacity: 1, scale: 1, rotate: 14, x: 0, y: -52 }
                  : { opacity: 0.95, scale: 0.86, rotate: 10, x: -4, y: 12 }
              }
              transition={{
                duration: 0.75,
                delay: isOpening ? 0.32 : 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute -right-3 sm:-right-7 top-[18%] z-30 pointer-events-none"
            >
              {/* Bread-Clip Tag Clipped to Top-Left of Postage Stamp */}
              <div className="absolute -top-4 sm:-top-5 left-1 sm:left-1.5 z-20 -rotate-[12deg] drop-shadow-md">
                <svg viewBox="0 0 54 48" className="w-8 h-7 sm:w-10 sm:h-9">
                  {/* Bread clip body with notched corners & keyhole slot */}
                  <path
                    d="M 6,2 L 48,2 L 52,8 L 52,42 Q 52,46 48,46 L 31,46 L 31,37 C 35,36 36,30 32,28 C 29,26 25,26 22,28 C 18,30 19,36 23,37 L 23,46 L 6,46 Q 2,46 2,42 L 2,8 Z"
                    fill="#E2E6E9"
                    stroke="#C8CFD4"
                    strokeWidth="1.2"
                  />
                  {/* Printed serial date on bread-clip */}
                  <text
                    x="27"
                    y="15"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="7.5"
                    fontFamily="monospace"
                    letterSpacing="0.8"
                  >
                    23.01.27
                  </text>
                </svg>
              </div>

              {/* Perforated Postage Stamp Frame */}
              <div
                className="relative p-2 sm:p-2.5 bg-white shadow-xl"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 0 50%, transparent 3.5px, #FFFFFF 4px), radial-gradient(circle at 100% 50%, transparent 3.5px, #FFFFFF 4px), radial-gradient(circle at 50% 0, transparent 3.5px, #FFFFFF 4px), radial-gradient(circle at 50% 100%, transparent 3.5px, #FFFFFF 4px)',
                  backgroundSize: '10px 10px',
                  border: '2px dashed #CBD5E1',
                  boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.28)',
                }}
              >
                <div className="w-16 h-20 sm:w-22 sm:h-26 bg-slate-950 overflow-hidden relative">
                  <img
                    src="/images/prewedding-1.jpg"
                    alt={`${couple.bride} & ${couple.groom} Stamp`}
                    className="w-full h-full object-cover opacity-95 contrast-105"
                  />
                  <div className="absolute bottom-1 right-1.5 text-[7px] font-mono text-white/85 tracking-tighter bg-black/50 px-1 rounded-xs">
                    A&amp;M 2027
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 5. POWDER-BLUE ENVELOPE FRONT POCKET & CALLIGRAPHY ("Why be normal?") */}
            <div className="absolute inset-0 z-25 pointer-events-none rounded-[14px] overflow-hidden">
              {/* Left & Right Diagonal Side Flaps */}
              <svg
                viewBox="0 0 400 280"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
              >
                {/* Left Side Flap */}
                <polygon
                  points="0,0 205,155 0,280"
                  fill="#C1DCE4"
                  stroke="#A9C7D1"
                  strokeWidth="1.2"
                />
                {/* Right Side Flap */}
                <polygon
                  points="400,0 195,155 400,280"
                  fill="#BCD8E1"
                  stroke="#A9C7D1"
                  strokeWidth="1.2"
                />
                {/* Bottom Trapezoid/Rounded Pocket Flap (Matches Reference Image) */}
                <path
                  d="M 0,280 L 145,126 Q 162,110 185,110 L 215,110 Q 238,110 255,126 L 400,280 Z"
                  fill="#C5E0E8"
                  stroke="#B0CED8"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Suede Paper Grain Texture Overlay on Envelope Pocket */}
              <div
                className="absolute inset-0 opacity-55 mix-blend-multiply"
                style={{ filter: 'url(#suede-paper-grain)' }}
              />

              {/* Front Pocket Printed Typography: (2027) [SAVE THE DATE] + Sweeping Script */}
              <div className="absolute inset-x-0 bottom-3 sm:bottom-5 flex flex-col items-center justify-end text-center px-3">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.12em] text-slate-900 leading-tight">
                  (2027)
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.1em] text-slate-900 uppercase leading-tight mt-0.5">
                  [BETTER TOGETHER • 23.01]
                </span>

                <div className="font-calligraphy text-4xl sm:text-6xl md:text-[64px] text-slate-950 leading-[0.88] tracking-normal mt-1 sm:mt-1.5 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
                  {couple.bride} &amp; {couple.groom}!
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Prompt (Only shown before tapping) */}
          <div className="relative z-30 pb-3 sm:pb-5 flex flex-col items-center text-center min-h-[44px]">
            {!isOpening && (
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#0074E2]" />
                <span>แตะส่วนใดก็ได้ของซองจดหมายเพื่อเปิดการ์ด • Tap anywhere</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
