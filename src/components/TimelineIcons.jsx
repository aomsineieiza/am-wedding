import React from 'react';
import { motion } from 'framer-motion';

// Lottie-Style Animated Vector Icons for Wedding Timeline
// Features smooth looping spring micro-animations, floating hearts, and glowing sparkles

// 1. Auspicious Engagement Ring Exchange (Twin Rings + Twinkling Diamond + Floating Kiss Hearts)
export function AnimatedRingIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Left Gold Ring */}
        <motion.circle
          cx="20"
          cy="26"
          r="10"
          stroke="#F59E0B"
          strokeWidth="3.2"
          animate={{ scale: [1, 1.05, 1], rotate: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Right Gold Ring */}
        <motion.circle
          cx="28"
          cy="26"
          r="10"
          stroke="#EAB308"
          strokeWidth="3.2"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
        />
        {/* Diamond Gem on Top Ring */}
        <motion.polygon
          points="20,10 24,14 20,18 16,14"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="1.2"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Diamond Shine Twinkle Rays */}
        <motion.path
          d="M20,6 L20,3 M25,9 L28,7 M15,9 L12,7"
          stroke="#38BDF8"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Floating Kisses / Hearts rising from rings */}
      <motion.div
        animate={{ y: [0, -16, -24], x: [0, 4, 8], opacity: [0, 1, 0], scale: [0.6, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.4 }}
        className="absolute top-0 right-1 text-xs text-rose-500 pointer-events-none select-none"
      >
        💖
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, -20], x: [0, -5, -8], opacity: [0, 1, 0], scale: [0.5, 0.9, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.8, repeatDelay: 0.6 }}
        className="absolute top-1 left-1 text-[10px] text-pink-400 pointer-events-none select-none"
      >
        💕
      </motion.div>
    </div>
  );
}

// 2. Sacred Conch Shell (สังข์หลั่งน้ำพระพุทธมนต์ + Animated Water Droplet Ripple)
export function AnimatedConchIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Conch Body */}
        <motion.path
          d="M12,28 C12,18 20,12 32,12 C36,12 38,15 36,20 C34,25 28,34 16,34 C12,34 12,31 12,28 Z"
          fill="#FEF3C7"
          stroke="#D97706"
          strokeWidth="2.4"
          strokeLinejoin="round"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Conch Gold Spiral Lines */}
        <path
          d="M18,22 C22,18 28,16 34,16 M18,28 C24,24 30,22 34,20"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Gold Tip */}
        <circle cx="36" cy="14" r="2.5" fill="#F59E0B" />

        {/* Animated Dripping Sacred Water Droplet */}
        <motion.path
          d="M14,35 Q14,40 12,42 Q10,40 10,35 Q10,32 12,30 Q14,32 14,35 Z"
          fill="#38BDF8"
          animate={{ y: [0, 8, 12], opacity: [1, 0.8, 0], scale: [0.8, 1.1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' }}
        />
      </svg>

      {/* Ripple wave at bottom */}
      <motion.div
        animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
        className="absolute -bottom-1 w-6 h-1.5 rounded-full border border-sky-400 pointer-events-none"
      />
    </div>
  );
}

// 3. Monk Blessing / Sacred Lotus (พิธีสงฆ์ - Lotus Blooming + Aura Rays)
export function AnimatedMonkLotusIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Sacred Aura Rays */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '24px 24px' }}
        >
          <line x1="24" y1="4" x2="24" y2="8" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="38" y1="10" x2="35" y2="13" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="44" y1="24" x2="40" y2="24" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="10" y1="10" x2="13" y2="13" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="4" y1="24" x2="8" y2="24" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>

        {/* Center Petal */}
        <motion.path
          d="M24,14 C27,20 28,26 24,32 C20,26 21,20 24,14 Z"
          fill="#F472B6"
          stroke="#DB2777"
          strokeWidth="2"
          animate={{ scaleY: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 32px' }}
        />
        {/* Left Petal */}
        <motion.path
          d="M23,20 C18,22 13,27 17,32 C20,32 23,28 23,20 Z"
          fill="#FBCFE8"
          stroke="#DB2777"
          strokeWidth="1.8"
          animate={{ rotate: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '23px 32px' }}
        />
        {/* Right Petal */}
        <motion.path
          d="M25,20 C30,22 35,27 31,32 C28,32 25,28 25,20 Z"
          fill="#FBCFE8"
          stroke="#DB2777"
          strokeWidth="1.8"
          animate={{ rotate: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '25px 32px' }}
        />
        {/* Water / Base */}
        <path d="M12,36 C18,34 30,34 36,36" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 4. Khan Maak Auspicious Tray (ขบวนขันหมาก - Garland & Auspicious Pedestal Tray)
export function AnimatedKhanMaakIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Pedestal Bowl Base (พานทอง) */}
        <path d="M10,22 L38,22 L32,32 L16,32 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M21,32 L20,40 L28,40 L27,32 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15,40 L33,40" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

        {/* Garland & Flowers on top (ดอกไม้และมาลัย) */}
        <motion.g
          animate={{ y: [0, -2, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 22px' }}
        >
          <ellipse cx="24" cy="18" rx="12" ry="6" fill="#34D399" stroke="#059669" strokeWidth="2" />
          <circle cx="24" cy="14" r="4" fill="#F43F5E" />
          <circle cx="18" cy="16" r="3" fill="#FBBF24" />
          <circle cx="30" cy="16" r="3" fill="#FBBF24" />
        </motion.g>

        {/* Swaying ribbon tails */}
        <motion.path
          d="M24,22 C22,28 20,32 21,38"
          stroke="#F43F5E"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ x: [-1, 1, -1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

// 5. Clinking Champagne Glasses (ฉลองมงคลสมรส / Toast - Toasting + Fizzy Bubbles)
export function AnimatedToastIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Left Glass */}
        <motion.g
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '16px 36px' }}
        >
          <path d="M14,12 L22,12 L20,24 C19,26 17,26 16,24 Z" fill="#FEF3C7" stroke="#0284C7" strokeWidth="2" strokeLinejoin="round" />
          <line x1="18" y1="25" x2="18" y2="36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="13" y1="36" x2="23" y2="36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          {/* Liquid */}
          <path d="M15,17 L21,17 L19,23 C18,24 17,24 17,23 Z" fill="#FCD34D" />
        </motion.g>

        {/* Right Glass */}
        <motion.g
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 36px' }}
        >
          <path d="M26,12 L34,12 L32,24 C31,26 29,26 28,24 Z" fill="#FEF3C7" stroke="#0284C7" strokeWidth="2" strokeLinejoin="round" />
          <line x1="30" y1="25" x2="30" y2="36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="36" x2="35" y2="36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          {/* Liquid */}
          <path d="M27,17 L33,17 L31,23 C30,24 29,24 29,23 Z" fill="#FCD34D" />
        </motion.g>

        {/* Clink Spark Stars */}
        <motion.path
          d="M24,10 L25,12 L27,13 L25,14 L24,16 L23,14 L21,13 L23,12 Z"
          fill="#F59E0B"
          animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Floating Champagne Bubbles */}
      <motion.div
        animate={{ y: [0, -14], opacity: [1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        className="absolute top-2 left-5 w-1.5 h-1.5 rounded-full bg-amber-400"
      />
      <motion.div
        animate={{ y: [0, -16], opacity: [1, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
        className="absolute top-1 right-5 w-1 h-1 rounded-full bg-amber-400"
      />
    </div>
  );
}

// 6. Wedding Cake (ตัดเค้กมงคล - Multi-tier Cake + Flickering Candles)
export function AnimatedCakeIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Bottom Tier */}
        <rect x="10" y="28" width="28" height="12" rx="3" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2.2" />
        {/* Mid Tier */}
        <rect x="15" y="18" width="18" height="10" rx="2.5" fill="#FFFFFF" stroke="#DB2777" strokeWidth="2.2" />
        {/* Frosting drips */}
        <path d="M10,32 Q14,35 18,32 Q22,35 26,32 Q30,35 34,32 Q38,35 38,32" stroke="#F43F5E" strokeWidth="1.8" fill="none" />
        <path d="M15,22 Q18,25 21,22 Q24,25 27,22 Q30,25 33,22" stroke="#F43F5E" strokeWidth="1.8" fill="none" />

        {/* Candles on Top */}
        <line x1="21" y1="18" x2="21" y2="13" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="27" y1="18" x2="27" y2="13" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />

        {/* Flickering Flames */}
        <motion.circle
          cx="21"
          cy="11"
          r="2.2"
          fill="#F59E0B"
          animate={{ scale: [0.8, 1.3, 0.9], y: [0, -1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="27"
          cy="11"
          r="2.2"
          fill="#EF4444"
          animate={{ scale: [1.2, 0.8, 1.1], y: [0, -1.5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

// 7. Vows / Kisses Romantic Hearts (คำมั่นสัญญา - Beating Double Hearts + Kiss Ripples)
export function AnimatedVowsHeartIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Left Heart */}
        <motion.path
          d="M20,16 C16,11 9,14 9,21 C9,28 20,36 20,36 C20,36 31,28 31,21 C31,14 24,11 20,16 Z"
          fill="#F43F5E"
          stroke="#E11D48"
          strokeWidth="2"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '20px 24px' }}
        />
        {/* Right Smaller Interlocking Heart */}
        <motion.path
          d="M30,12 C27,8 21,10 21,16 C21,21 30,27 30,27 C30,27 39,21 39,16 C39,10 33,8 30,12 Z"
          fill="#FB7185"
          stroke="#E11D48"
          strokeWidth="1.8"
          animate={{ scale: [1.1, 0.95, 1.1], rotate: [0, 5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '30px 18px' }}
        />
      </svg>

      {/* Love Pulse Waves */}
      <motion.div
        animate={{ scale: [0.8, 1.6], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        className="absolute inset-1 rounded-full border border-rose-300 pointer-events-none"
      />
    </div>
  );
}

// 8. Party / Music Concert (ปาร์ตี้เฉลิมฉลอง - Dancing Notes + Sound Waves)
export function AnimatedMusicPartyIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Music Double Note */}
        <motion.path
          d="M16,30 C16,33 13,35 11,34 C9,33 9,30 11,28 C13,27 16,28 16,30 Z M16,30 L16,14 L32,10 L32,26 C32,29 29,31 27,30 C25,29 25,26 27,24 C29,23 32,24 32,26 Z M16,18 L32,14"
          fill="#8B5CF6"
          stroke="#6D28D9"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, -3, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 24px' }}
        />
        {/* Joyful Star Sparkles */}
        <motion.path
          d="M38,14 L39,17 L42,18 L39,19 L38,22 L37,19 L34,18 L37,17 Z"
          fill="#FBBF24"
          animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

// 9. Flower Bouquet Toss (โยนช่อดอกไม้)
export function AnimatedBouquetIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Bouquet Stem & Wrap */}
        <path d="M20,24 L16,38 L22,36 L24,26" fill="#FDE68A" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24,26 L26,36 L32,38 L28,24" fill="#FDE68A" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />

        {/* Blooming Roses Cluster */}
        <motion.g
          animate={{ rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 18px' }}
        >
          <circle cx="24" cy="14" r="7" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
          <circle cx="17" cy="19" r="6" fill="#FB7185" stroke="#BE123C" strokeWidth="1.8" />
          <circle cx="31" cy="19" r="6" fill="#FDA4AF" stroke="#BE123C" strokeWidth="1.8" />
          {/* Leaves */}
          <path d="M12,14 Q8,18 13,22" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M36,14 Q40,18 35,22" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  );
}

// Helper function to pick the right Lottie-style animated icon based on ceremony item
export function CeremonyAnimatedIcon({ title = '', desc = '' }) {
  if (title.includes('Monk') || desc.includes('สงฆ์')) {
    return <AnimatedMonkLotusIcon />;
  }
  if (title.includes('Khan Maak') || desc.includes('ขันหมาก')) {
    return <AnimatedKhanMaakIcon />;
  }
  if (title.includes('Ring') || desc.includes('แหวน')) {
    return <AnimatedRingIcon />;
  }
  if (title.includes('Water') || desc.includes('หลั่งน้ำ')) {
    return <AnimatedConchIcon />;
  }
  if (title.includes('Cake') || desc.includes('เค้ก')) {
    return <AnimatedCakeIcon />;
  }
  if (title.includes('Toast') || title.includes('Cocktail') || desc.includes('ค็อกเทล')) {
    return <AnimatedToastIcon />;
  }
  if (title.includes('Vow') || desc.includes('คำมั่นสัญญา')) {
    return <AnimatedVowsHeartIcon />;
  }
  if (title.includes('Bouquet') || desc.includes('ช่อดอกไม้')) {
    return <AnimatedBouquetIcon />;
  }
  if (title.includes('Party') || desc.includes('ปาร์ตี้') || desc.includes('คอนเสิร์ต')) {
    return <AnimatedMusicPartyIcon />;
  }
  return <AnimatedToastIcon />;
}
