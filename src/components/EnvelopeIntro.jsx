import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { weddingAudio } from '../utils/audioPlayer';

export default function EnvelopeIntro({ onOpen }) {
  const { couple } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      weddingAudio.play();
    } catch {
      // Audio fallback
    }

    setTimeout(() => {
      setIsOpen(true);
      if (onOpen) onOpen();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="envelope-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-[#F8FAFC] overflow-hidden select-none"
        >
          {/* Subtle Glows */}
          <div className="absolute top-0 left-0 w-48 sm:w-80 h-48 sm:h-80 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,#0074E2_0%,transparent_70%)]" />
          <div className="absolute top-0 right-0 w-48 sm:w-80 h-48 sm:h-80 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#CBD5E1_0%,transparent_70%)]" />
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Header Area */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center pt-4 sm:pt-8 z-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] border border-[#C4DDFB] text-[#0074E2] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SAVE THE DATE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight font-bold">
              <span>{couple.bride}</span>
              <span className="text-2xl sm:text-4xl text-[#0074E2] mx-2 font-normal">
                and
              </span>
              <span>{couple.groom}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal tracking-wide">
              เรียนเชิญร่วมงานฉลองมงคลสมรส (กดที่ซองจดหมายเพื่อเปิดคำเชิญ)
            </p>
          </motion.div>

          {/* Envelope Centerpiece with 3D Flap & Wax Seal */}
          <div className="relative my-auto py-8 z-10 flex flex-col items-center">
            <motion.div
              onClick={handleOpenEnvelope}
              whileHover={{ scale: isOpening ? 1 : 1.03 }}
              whileTap={{ scale: isOpening ? 1 : 0.98 }}
              className="relative w-[310px] sm:w-[380px] h-[210px] sm:h-[250px] cursor-pointer group"
              style={{ perspective: 1200 }}
            >
              {/* Envelope Back Base */}
              <div className="absolute inset-0 bg-[#E2E8F0] rounded-2xl shadow-2xl border border-slate-300" />

              {/* Letter Card (slides up when opening) */}
              <motion.div
                initial={{ y: 0, opacity: 0.9 }}
                animate={
                  isOpening
                    ? { y: -130, opacity: 1, scale: 1.03 }
                    : { y: 0, opacity: 0.9 }
                }
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-xl p-5 shadow-md border border-slate-200 flex flex-col items-center justify-center text-center z-10"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF4FE] border border-[#C4DDFB] flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-[#0074E2]">
                    {couple.initials}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl text-slate-900 font-bold leading-tight">
                  {couple.bride} &amp; {couple.groom}
                </h3>
                <p className="text-[11px] text-[#0074E2] font-semibold uppercase tracking-widest mt-1">
                  {couple.dateFormatted}
                </p>
                <p className="text-xs text-slate-500 mt-2 font-normal">
                  &ldquo;Forever Begins Today&rdquo;
                </p>
              </motion.div>

              {/* Envelope Pocket Front */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div
                  className="absolute inset-0 bg-[#EDF2F7] rounded-2xl"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
                    filter: 'drop-shadow(1px 0 2px rgba(0,0,0,0.06))',
                  }}
                />
                <div
                  className="absolute inset-0 bg-[#EDF2F7] rounded-2xl"
                  style={{
                    clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
                    filter: 'drop-shadow(-1px 0 2px rgba(0,0,0,0.06))',
                  }}
                />
                <div
                  className="absolute inset-0 bg-[#E2E8F0] rounded-2xl border-b border-slate-300"
                  style={{
                    clipPath: 'polygon(0% 100%, 50% 45%, 100% 100%)',
                    filter: 'drop-shadow(0 -2px 3px rgba(0,0,0,0.08))',
                  }}
                />
              </div>

              {/* Top Envelope Flap */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute inset-x-0 top-0 h-1/2 z-30 pointer-events-none"
              >
                <div
                  className="w-full h-full bg-[#E2E8F0] rounded-t-2xl border-t border-slate-300"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
                    filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.12))',
                  }}
                />
              </motion.div>

              {/* Wax Seal Stamp with AM monogram */}
              <motion.div
                initial={{ scale: 1 }}
                animate={isOpening ? { scale: 0, opacity: 0 } : { scale: [1, 1.04, 1] }}
                transition={
                  isOpening
                    ? { duration: 0.3 }
                    : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }
                className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center pointer-events-none"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0074E2] to-[#0055A5] shadow-lg border-2 border-white flex items-center justify-center p-1 relative">
                  <div className="w-full h-full rounded-full border border-dashed border-white/60 flex items-center justify-center">
                    <span className="text-sm sm:text-base font-bold text-white tracking-widest drop-shadow-xs">
                      {couple.initials}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Click to open badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-6 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-xs text-slate-800 shadow-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0074E2]" />
              <span>แตะที่ซองจดหมายเพื่อเปิดคำเชิญ • Tap to open</span>
            </motion.div>
          </div>

          {/* Bottom Illustrated Couple & Floral Garland */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-lg mx-auto flex flex-col items-center z-10"
          >
            <div className="relative flex items-end justify-center -space-x-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-lg overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
                  alt={couple.groom}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-lg overflow-hidden bg-slate-100 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80"
                  alt={couple.bride}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-2 font-medium">
              With Love, {couple.bride} &amp; {couple.groom}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
