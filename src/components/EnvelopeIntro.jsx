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

    // Try starting ambient music on user click
    try {
      weddingAudio.play();
    } catch {
      // Audio context will start on next interaction
    }

    // Trigger open animation sequence
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
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-[#FBF9F5] overflow-hidden select-none"
        >
          {/* Subtle Watercolor Floral Background Overlays */}
          <div className="absolute top-0 left-0 w-48 sm:w-80 h-48 sm:h-80 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,#E6D2C9_0%,transparent_70%)]" />
          <div className="absolute top-0 right-0 w-48 sm:w-80 h-48 sm:h-80 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#E8ECE6_0%,transparent_70%)]" />
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#C8B89E_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Decorative Branch SVGs */}
          <svg className="absolute -top-10 -left-10 w-48 h-48 sm:w-72 sm:h-72 opacity-25 text-[#9EAB9C] pointer-events-none" viewBox="0 0 200 200" fill="currentColor">
            <path d="M20,180 Q60,120 120,80 Q160,50 180,20 Q140,50 90,90 Q40,130 20,180 Z" />
            <ellipse cx="60" cy="130" rx="15" ry="8" transform="rotate(-30 60 130)" opacity="0.6" />
            <ellipse cx="100" cy="95" rx="16" ry="9" transform="rotate(-40 100 95)" opacity="0.6" />
            <ellipse cx="140" cy="60" rx="14" ry="7" transform="rotate(-50 140 60)" opacity="0.6" />
          </svg>
          <svg className="absolute -top-10 -right-10 w-48 h-48 sm:w-72 sm:h-72 opacity-25 text-[#9EAB9C] pointer-events-none -scale-x-100" viewBox="0 0 200 200" fill="currentColor">
            <path d="M20,180 Q60,120 120,80 Q160,50 180,20 Q140,50 90,90 Q40,130 20,180 Z" />
            <ellipse cx="60" cy="130" rx="15" ry="8" transform="rotate(-30 60 130)" opacity="0.6" />
            <ellipse cx="100" cy="95" rx="16" ry="9" transform="rotate(-40 100 95)" opacity="0.6" />
            <ellipse cx="140" cy="60" rx="14" ry="7" transform="rotate(-50 140 60)" opacity="0.6" />
          </svg>

          {/* Header Area */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center pt-4 sm:pt-8 z-10"
          >
            <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#A38F70] font-medium mb-1">
              SAVE THE DATE
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2D2926] tracking-wide font-light">
              <span className="uppercase">{couple.bride}</span>
              <span className="font-serif italic text-2xl sm:text-4xl text-[#C8B89E] mx-2 font-normal">
                and
              </span>
              <span className="uppercase">{couple.groom}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8C827A] mt-2 font-light tracking-wider">
              เรียนเชิญร่วมงานฉลองมงคลสมรส (กดที่ซองจดหมาย)
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
              <div className="absolute inset-0 bg-[#E8E0D2] rounded-2xl shadow-2xl border border-[#D8CEBC]" />

              {/* Letter Card (slides up when opening) */}
              <motion.div
                initial={{ y: 0, opacity: 0.9 }}
                animate={
                  isOpening
                    ? { y: -130, opacity: 1, scale: 1.03 }
                    : { y: 0, opacity: 0.9 }
                }
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-4 top-4 bottom-4 bg-[#FAF8F5] rounded-xl p-5 shadow-md border border-[#E8E2D8] flex flex-col items-center justify-center text-center z-10"
              >
                <div className="w-10 h-10 rounded-full border border-[#C8B89E]/60 flex items-center justify-center mb-2">
                  <span className="font-serif text-sm tracking-widest text-[#2D2926] font-medium">
                    {couple.initials}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#2D2926] font-normal leading-tight">
                  {couple.bride} &amp; {couple.groom}
                </h3>
                <p className="text-[11px] text-[#A38F70] uppercase tracking-widest mt-1">
                  {couple.dateFormatted}
                </p>
                <p className="font-serif italic text-xs text-[#6B635B] mt-2">
                  &ldquo;Forever Begins Today&rdquo;
                </p>
              </motion.div>

              {/* Envelope Pocket Front (Triangles Left, Right & Bottom) */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Left fold */}
                <div
                  className="absolute inset-0 bg-[#EDE5D8] rounded-2xl"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
                    filter: 'drop-shadow(1px 0 2px rgba(0,0,0,0.06))',
                  }}
                />
                {/* Right fold */}
                <div
                  className="absolute inset-0 bg-[#EDE5D8] rounded-2xl"
                  style={{
                    clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
                    filter: 'drop-shadow(-1px 0 2px rgba(0,0,0,0.06))',
                  }}
                />
                {/* Bottom fold */}
                <div
                  className="absolute inset-0 bg-[#E5DCCF] rounded-2xl border-b border-[#D8CEBC]"
                  style={{
                    clipPath: 'polygon(0% 100%, 50% 45%, 100% 100%)',
                    filter: 'drop-shadow(0 -2px 3px rgba(0,0,0,0.08))',
                  }}
                />
              </div>

              {/* Top Envelope Flap (Flips open 180 degrees) */}
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
                  className="w-full h-full bg-[#E5DCCF] rounded-t-2xl border-t border-[#D8CEBC]"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
                    filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.12))',
                  }}
                />
              </motion.div>

              {/* Wax Seal & Dried Flower Ornament */}
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
                {/* Dried Baby's Breath / Flower sprig behind seal */}
                <div className="absolute -top-6 w-12 h-12 flex items-center justify-center opacity-85">
                  <span className="text-xl select-none">🌾</span>
                </div>

                {/* Golden Wax Seal Stamp with AM monogram */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#E2D4BF] via-[#C8B89E] to-[#A38F70] shadow-lg border-2 border-[#FAF8F5]/80 flex items-center justify-center p-1 relative">
                  {/* Subtle inner seal stamp ring */}
                  <div className="w-full h-full rounded-full border border-dashed border-[#FAF8F5]/60 flex items-center justify-center shadow-inner">
                    <span className="font-serif text-sm sm:text-base font-bold text-[#FAF8F5] tracking-widest drop-shadow-xs">
                      {couple.initials}
                    </span>
                  </div>
                  {/* Wax drip edge simulation */}
                  <div className="absolute -bottom-1 left-2 w-3 h-3 bg-[#A38F70] rounded-full blur-[0.5px]" />
                  <div className="absolute -right-1 top-2 w-2.5 h-2.5 bg-[#C8B89E] rounded-full blur-[0.5px]" />
                </div>
              </motion.div>
            </motion.div>

            {/* Click to open badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-6 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8E2D8] text-xs font-serif text-[#2D2926] shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8B89E]" />
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
            {/* Romantic Watercolor Flower Border */}
            <div className="flex items-center justify-center gap-2 text-2xl select-none opacity-80 mb-2">
              <span>🌸</span>
              <span>🌿</span>
              <span>🤍</span>
              <span>🌿</span>
              <span>🌸</span>
            </div>

            {/* Couple Illustration Badge */}
            <div className="relative flex items-end justify-center -space-x-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-lg overflow-hidden bg-[#FAF8F5]">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
                  alt={couple.groom}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-lg overflow-hidden bg-[#FAF8F5] relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80"
                  alt={couple.bride}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="font-serif italic text-xs text-[#8C827A] mt-2 mb-2">
              With Love, {couple.bride} &amp; {couple.groom}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

