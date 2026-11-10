import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { weddingAudio } from '../utils/audioPlayer';

export default function EnvelopeIntro({ onOpen }) {
  const { couple, venue } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);

    try {
      weddingAudio.play();
    } catch {
      // Audio fallback
    }

    // Step 1: Flap flips past 90 degrees -> drop z-index behind letter card
    setTimeout(() => {
      setFlapBehind(true);
    }, 280);

    // Step 2: Letter card has fully slid out of envelope pocket
    setTimeout(() => {
      setIsOpened(true);
    }, 900);

    // Step 3: Auto-transition to website if user hasn't clicked after 3.2s
    setTimeout(() => {
      handleEnterWebsite();
    }, 3800);
  };

  const handleEnterWebsite = () => {
    if (isExiting) return;
    setIsExiting(true);

    setTimeout(() => {
      setIsOpen(true);
      if (onOpen) onOpen();
    }, 600);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="envelope-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 figjam-bg overflow-hidden select-none"
        >
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,#0074E2_0%,transparent_70%)]" />
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 opacity-25 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#CBD5E1_0%,transparent_70%)]" />

          {/* Header Area */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center pt-3 sm:pt-6 z-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBF4FE] border border-[#C4DDFB] text-[#0074E2] text-xs font-semibold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SAVE THE DATE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight font-bold">
              <span>{couple.bride}</span>
              <span className="text-2xl sm:text-4xl text-[#0074E2] mx-2 font-normal">
                &amp;
              </span>
              <span>{couple.groom}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal tracking-wide">
              {isOpened
                ? 'คำเชิญของคุณพร้อมแล้ว กดเข้าสู่เว็บไซต์เพื่อดูรายละเอียด'
                : 'เรียนเชิญร่วมงานฉลองมงคลสมรส (แตะที่ซองจดหมายเพื่อเปิดคำเชิญ)'}
            </p>
          </motion.div>

          {/* Envelope Centerpiece with 3D Flap & Wax Seal */}
          <div className="relative my-auto py-4 z-10 flex flex-col items-center">
            <motion.div
              onClick={handleOpenEnvelope}
              whileHover={{ scale: isOpening ? 1 : 1.02 }}
              whileTap={{ scale: isOpening ? 1 : 0.98 }}
              className="relative w-[320px] sm:w-[420px] h-[215px] sm:h-[265px] cursor-pointer group"
              style={{ perspective: 1200 }}
            >
              {/* 1. Envelope Back Base (z-0) */}
              <div className="absolute inset-0 bg-[#F1F5F9] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300 overflow-hidden">
                {/* Inner Lining Texture (champagne luxury lining) */}
                <div className="absolute inset-2 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#F5EBE1] to-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center opacity-90" />
              </div>

              {/* 2. Top Flap (Lid) with 3D Rotate */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: isOpening ? 180 : 0 }}
                transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute inset-x-0 top-0 h-[56%] pointer-events-none transition-[z-index] duration-0 ${
                  flapBehind ? 'z-[5]' : 'z-[35]'
                }`}
              >
                {/* Front face of flap (visible when closed) */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] rounded-t-2xl sm:rounded-t-3xl border-t border-slate-300"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
                    filter: 'drop-shadow(0 4px 6px rgba(15, 23, 42, 0.09))',
                    backfaceVisibility: 'hidden',
                  }}
                />

                {/* Back face of flap (visible when flipped open 180deg) */}
                <div
                  className="absolute inset-0 bg-[#F5EBE1] rounded-t-2xl sm:rounded-t-3xl border-b border-[#E8E2D8]"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
                    transform: 'rotateX(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                />
              </motion.div>

              {/* 3. Letter Invitation Card (z-20) */}
              <motion.div
                initial={{ y: 0, scale: 0.98, opacity: 0.95 }}
                animate={
                  isExiting
                    ? { y: -230, scale: 1.25, opacity: 0 }
                    : isOpened
                    ? { y: -185, scale: 1.05, opacity: 1 }
                    : isOpening
                    ? { y: -140, scale: 1.02, opacity: 1 }
                    : { y: 0, scale: 0.98, opacity: 0.95 }
                }
                transition={{
                  duration: isExiting ? 0.5 : 0.85,
                  delay: isExiting ? 0 : (isOpening ? 0.35 : 0),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-x-4 sm:inset-x-6 top-3 bottom-3 bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200/90 flex flex-col items-center justify-between text-center z-20 pointer-events-auto"
              >
                {/* Letter Header */}
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#EBF4FE] border border-[#C4DDFB] flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                    <span className="text-sm font-bold text-[#0074E2]">{couple.initials}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#0074E2] font-semibold">
                    Wedding Invitation
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                    {couple.bride} <span className="text-[#0074E2] font-normal">&amp;</span> {couple.groom}
                  </h3>
                </div>

                {/* Letter Details */}
                <div className="py-2 border-y border-slate-100 w-full my-1">
                  <p className="text-xs font-semibold text-slate-800">
                    {couple.dateFormatted}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {venue.name} • {venue.city}
                  </p>
                </div>

                {/* Letter Action Button */}
                {isOpened ? (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnterWebsite();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>เปิดคำเชิญ • เข้าสู่เว็บไซต์</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    &ldquo;{couple.quote}&rdquo;
                  </p>
                )}
              </motion.div>

              {/* 4. Envelope Front Pocket (z-25) */}
              <div className="absolute inset-0 z-25 pointer-events-none">
                {/* Left Flap */}
                <div
                  className="absolute inset-0 bg-[#EDF2F7] rounded-2xl sm:rounded-3xl"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
                    filter: 'drop-shadow(2px 0 3px rgba(15, 23, 42, 0.05))',
                  }}
                />
                {/* Right Flap */}
                <div
                  className="absolute inset-0 bg-[#EDF2F7] rounded-2xl sm:rounded-3xl"
                  style={{
                    clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
                    filter: 'drop-shadow(-2px 0 3px rgba(15, 23, 42, 0.05))',
                  }}
                />
                {/* Bottom Flap */}
                <div
                  className="absolute inset-0 bg-[#E2E8F0] rounded-2xl sm:rounded-3xl border-b border-slate-300"
                  style={{
                    clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)',
                    filter: 'drop-shadow(0 -3px 4px rgba(15, 23, 42, 0.07))',
                  }}
                />
              </div>

              {/* 5. Wax Seal Stamp with Monogram (z-40) */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={
                  isOpening
                    ? { scale: 0, opacity: 0 }
                    : { scale: [1, 1.05, 1] }
                }
                transition={
                  isOpening
                    ? { duration: 0.3, ease: 'easeIn' }
                    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                }
                className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0088FF] via-[#0074E2] to-[#0052A3] shadow-xl border-2 border-white flex items-center justify-center p-1 relative">
                  <div className="w-full h-full rounded-full border border-dashed border-white/60 flex items-center justify-center">
                    <span className="text-sm sm:text-base font-bold text-white tracking-widest drop-shadow-xs">
                      {couple.initials}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Tap to open indicator */}
            {!isOpening && (
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-6 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-xs text-slate-800 shadow-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0074E2]" />
                <span>แตะที่ซองจดหมายเพื่อเปิดคำเชิญ • Tap to open</span>
              </motion.div>
            )}

            {/* When opened, quick enter button below */}
            {isOpened && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleEnterWebsite}
                className="mt-6 flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 hover:bg-white text-xs text-slate-700 hover:text-[#0074E2] border border-slate-200 hover:border-[#0074E2] shadow-sm transition-all cursor-pointer font-medium"
              >
                <span>เข้าชมเว็บไซต์งานแต่งงาน</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center z-10 pb-2">
            <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
              #AomsinMild2026 • 28.11.2026
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
