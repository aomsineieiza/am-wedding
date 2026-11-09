import React from 'react';
import { motion } from 'framer-motion';

// Minimal Theme Colors matching Fastwork Blue & Warm Champagne Editorial Palette
const THEME = {
  blue: '#0074E2',
  blueDark: '#0055A5',
  blueLight: '#EBF4FE',
  blueBorder: '#C4DDFB',
  dark: '#1E293B',
  muted: '#64748B',
  subtle: '#94A3B8',
  champagne: '#C8B89E',
  champagneLight: '#F7F4EF',
  champagneBorder: '#E8E2D8',
};

// 1. Auspicious Engagement Ring Exchange (Twin Rings + Minimal Diamond Twinkle + Floating Vector Heart)
export function AnimatedRingIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Left Ring - Minimal Slate / Blue */}
        <motion.circle
          cx="20"
          cy="26"
          r="10"
          stroke={THEME.blue}
          strokeWidth="2.5"
          animate={{ scale: [1, 1.04, 1], rotate: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Right Ring - Minimal Warm Champagne */}
        <motion.circle
          cx="28"
          cy="26"
          r="10"
          stroke={THEME.champagne}
          strokeWidth="2.5"
          animate={{ scale: [1, 1.04, 1], rotate: [0, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
        />
        {/* Minimal Faceted Diamond */}
        <motion.polygon
          points="20,11 24,15 20,19 16,15"
          fill={THEME.blueLight}
          stroke={THEME.blue}
          strokeWidth="1.5"
          strokeLinejoin="round"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Diamond Sparkle Rays */}
        <motion.path
          d="M20,7 L20,4 M25,10 L28,8 M15,10 L12,8"
          stroke={THEME.blue}
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Floating Minimal Vector Heart */}
      <motion.div
        animate={{ y: [0, -14, -22], x: [0, 3, 6], opacity: [0, 0.9, 0], scale: [0.5, 0.9, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.5 }}
        className="absolute top-0 right-1 pointer-events-none select-none text-[#0074E2]"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
    </div>
  );
}

// 2. Sacred Conch Shell (สังข์หลั่งน้ำพระพุทธมนต์ - Minimal Duotone + Droplet Ripple)
export function AnimatedConchIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Conch Body in Minimal Champagne / Slate */}
        <motion.path
          d="M12,28 C12,18 20,12 32,12 C36,12 38,15 36,20 C34,25 28,34 16,34 C12,34 12,31 12,28 Z"
          fill={THEME.champagneLight}
          stroke={THEME.dark}
          strokeWidth="2.2"
          strokeLinejoin="round"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Conch Minimal Spiral Lines */}
        <path
          d="M18,22 C22,18 28,16 34,16 M18,28 C24,24 30,22 34,20"
          stroke={THEME.champagne}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Conch Accent Dot */}
        <circle cx="36" cy="14" r="2" fill={THEME.blue} />

        {/* Minimal Dripping Sacred Water Droplet */}
        <motion.path
          d="M14,35 Q14,40 12,42 Q10,40 10,35 Q10,32 12,30 Q14,32 14,35 Z"
          fill={THEME.blue}
          animate={{ y: [0, 8, 12], opacity: [1, 0.8, 0], scale: [0.8, 1.1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' }}
        />
      </svg>

      {/* Ripple wave at bottom */}
      <motion.div
        animate={{ scale: [0.6, 1.4], opacity: [0.7, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
        className="absolute -bottom-1 w-6 h-1.5 rounded-full border border-[#C4DDFB] pointer-events-none"
      />
    </div>
  );
}

// 3. Monk Blessing / Sacred Lotus (พิธีสงฆ์ - Minimal Lotus Blooming + Soft Aura)
export function AnimatedMonkLotusIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Subtle Sacred Aura Rays */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '24px 24px' }}
        >
          <line x1="24" y1="4" x2="24" y2="7" stroke={THEME.champagne} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="10" x2="35" y2="13" stroke={THEME.champagne} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="24" x2="41" y2="24" stroke={THEME.champagne} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="10" x2="13" y2="13" stroke={THEME.champagne} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="24" x2="7" y2="24" stroke={THEME.champagne} strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* Center Petal - Minimal Blue Accent */}
        <motion.path
          d="M24,14 C27,20 28,26 24,32 C20,26 21,20 24,14 Z"
          fill={THEME.blueLight}
          stroke={THEME.blue}
          strokeWidth="2"
          animate={{ scaleY: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 32px' }}
        />
        {/* Left Petal */}
        <motion.path
          d="M23,20 C18,22 13,27 17,32 C20,32 23,28 23,20 Z"
          fill="#FFFFFF"
          stroke={THEME.muted}
          strokeWidth="1.6"
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '23px 32px' }}
        />
        {/* Right Petal */}
        <motion.path
          d="M25,20 C30,22 35,27 31,32 C28,32 25,28 25,20 Z"
          fill="#FFFFFF"
          stroke={THEME.muted}
          strokeWidth="1.6"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '25px 32px' }}
        />
        {/* Base Water Line */}
        <path d="M12,35 C18,33 30,33 36,35" stroke={THEME.blue} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 4. Khan Maak Auspicious Tray (ขบวนขันหมาก - Minimal Pedestal Tray & Auspicious Garland)
export function AnimatedKhanMaakIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Pedestal Bowl Base (พาน) */}
        <path d="M10,22 L38,22 L32,32 L16,32 Z" fill="#FFFFFF" stroke={THEME.dark} strokeWidth="2" strokeLinejoin="round" />
        <path d="M21,32 L20,40 L28,40 L27,32 Z" fill={THEME.champagneLight} stroke={THEME.dark} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M15,40 L33,40" stroke={THEME.champagne} strokeWidth="2.2" strokeLinecap="round" />

        {/* Minimal Floral Arrangement */}
        <motion.g
          animate={{ y: [0, -2, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 22px' }}
        >
          <ellipse cx="24" cy="18" rx="12" ry="6" fill={THEME.blueLight} stroke={THEME.blue} strokeWidth="1.8" />
          <circle cx="24" cy="14" r="3.5" fill={THEME.blue} />
          <circle cx="18" cy="16" r="2.5" fill={THEME.champagne} />
          <circle cx="30" cy="16" r="2.5" fill={THEME.champagne} />
        </motion.g>

        {/* Minimal Ribbon Tails */}
        <motion.path
          d="M24,22 C22,28 20,32 21,38"
          stroke={THEME.blue}
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{ x: [-1, 1, -1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

// 5. Clinking Champagne Glasses (ฉลองมงคลสมรส / Toast - Minimal Line Art & Fizz)
export function AnimatedToastIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Left Glass */}
        <motion.g
          animate={{ rotate: [0, 9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '16px 36px' }}
        >
          <path d="M14,13 L22,13 L20,24 C19,26 17,26 16,24 Z" fill={THEME.blueLight} stroke={THEME.dark} strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="18" y1="25" x2="18" y2="36" stroke={THEME.dark} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="13" y1="36" x2="23" y2="36" stroke={THEME.dark} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15,18 L21,18 L19,23 C18,24 17,24 17,23 Z" fill={THEME.blue} fillOpacity="0.25" />
        </motion.g>

        {/* Right Glass */}
        <motion.g
          animate={{ rotate: [0, -9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '32px 36px' }}
        >
          <path d="M26,13 L34,13 L32,24 C31,26 29,26 28,24 Z" fill={THEME.champagneLight} stroke={THEME.champagne} strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="30" y1="25" x2="30" y2="36" stroke={THEME.champagne} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="25" y1="36" x2="35" y2="36" stroke={THEME.champagne} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M27,18 L33,18 L31,23 C30,24 29,24 29,23 Z" fill={THEME.champagne} fillOpacity="0.4" />
        </motion.g>

        {/* Minimal Clink Spark */}
        <motion.path
          d="M24,11 L25,13 L27,14 L25,15 L24,17 L23,15 L21,14 L23,13 Z"
          fill={THEME.blue}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Floating Minimal Fizz Bubbles */}
      <motion.div
        animate={{ y: [0, -14], opacity: [0.9, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        className="absolute top-2 left-5 w-1.5 h-1.5 rounded-full bg-[#0074E2]"
      />
      <motion.div
        animate={{ y: [0, -16], opacity: [0.9, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
        className="absolute top-1 right-5 w-1.5 h-1.5 rounded-full bg-[#C8B89E]"
      />
    </div>
  );
}

// 6. Wedding Cake (ตัดเค้กมงคล - Minimal Tiered Cake + Subtle Candle Flicker)
export function AnimatedCakeIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Bottom Tier */}
        <rect x="10" y="28" width="28" height="12" rx="3" fill="#FFFFFF" stroke={THEME.dark} strokeWidth="2" />
        {/* Mid Tier */}
        <rect x="15" y="18" width="18" height="10" rx="2.5" fill={THEME.blueLight} stroke={THEME.blue} strokeWidth="1.8" />
        
        {/* Minimal Decorative Lines */}
        <path d="M10,32 Q14,35 18,32 Q22,35 26,32 Q30,35 34,32 Q38,35 38,32" stroke={THEME.champagne} strokeWidth="1.4" fill="none" />

        {/* Candles on Top */}
        <line x1="21" y1="18" x2="21" y2="13" stroke={THEME.muted} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="27" y1="18" x2="27" y2="13" stroke={THEME.muted} strokeWidth="1.6" strokeLinecap="round" />

        {/* Minimal Flickering Flames */}
        <motion.circle
          cx="21"
          cy="11"
          r="2"
          fill={THEME.blue}
          animate={{ scale: [0.8, 1.25, 0.9], y: [0, -1, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="27"
          cy="11"
          r="2"
          fill={THEME.champagne}
          animate={{ scale: [1.2, 0.8, 1.1], y: [0, -1.2, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

// 7. Vows / Kisses Romantic Hearts (คำมั่นสัญญา - Minimal Beating Double Hearts)
export function AnimatedVowsHeartIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Left Heart - Minimal Blue */}
        <motion.path
          d="M20,16 C16,11 9,14 9,21 C9,28 20,36 20,36 C20,36 31,28 31,21 C31,14 24,11 20,16 Z"
          fill={THEME.blueLight}
          stroke={THEME.blue}
          strokeWidth="2.2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '20px 24px' }}
        />
        {/* Right Smaller Interlocking Heart - Champagne */}
        <motion.path
          d="M30,12 C27,8 21,10 21,16 C21,21 30,27 30,27 C30,27 39,21 39,16 C39,10 33,8 30,12 Z"
          fill={THEME.champagneLight}
          stroke={THEME.champagne}
          strokeWidth="1.8"
          animate={{ scale: [1.1, 0.95, 1.1], rotate: [0, 4, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ transformOrigin: '30px 18px' }}
        />
      </svg>

      {/* Love Pulse Waves */}
      <motion.div
        animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        className="absolute inset-1 rounded-full border border-[#C4DDFB] pointer-events-none"
      />
    </div>
  );
}

// 8. Party / Music Concert (ปาร์ตี้เฉลิมฉลอง - Minimal Duotone Note & Star)
export function AnimatedMusicPartyIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Music Double Note */}
        <motion.path
          d="M16,30 C16,33 13,35 11,34 C9,33 9,30 11,28 C13,27 16,28 16,30 Z M16,30 L16,14 L32,10 L32,26 C32,29 29,31 27,30 C25,29 25,26 27,24 C29,23 32,24 32,26 Z M16,18 L32,14"
          fill={THEME.blueLight}
          stroke={THEME.blue}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, -3, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 24px' }}
        />
        {/* Minimal Sparkle Star */}
        <motion.path
          d="M38,14 L39,17 L42,18 L39,19 L38,22 L37,19 L34,18 L37,17 Z"
          fill={THEME.champagne}
          animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

// 9. Flower Bouquet Toss (โยนช่อดอกไม้ - Minimal Duotone Blooms)
export function AnimatedBouquetIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 48 48" className="w-10 h-10 overflow-visible" fill="none">
        {/* Bouquet Stem & Wrap */}
        <path d="M20,24 L16,38 L22,36 L24,26" fill="#FFFFFF" stroke={THEME.dark} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M24,26 L26,36 L32,38 L28,24" fill={THEME.champagneLight} stroke={THEME.champagne} strokeWidth="1.8" strokeLinejoin="round" />

        {/* Minimal Blooming Roses Cluster */}
        <motion.g
          animate={{ rotate: [-2, 2, -2], scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 18px' }}
        >
          <circle cx="24" cy="14" r="7" fill={THEME.blueLight} stroke={THEME.blue} strokeWidth="1.8" />
          <circle cx="17" cy="19" r="5.5" fill="#FFFFFF" stroke={THEME.dark} strokeWidth="1.6" />
          <circle cx="31" cy="19" r="5.5" fill={THEME.champagneLight} stroke={THEME.champagne} strokeWidth="1.6" />
          {/* Minimal Stem Lines */}
          <path d="M12,14 Q9,18 13,21" stroke={THEME.muted} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M36,14 Q39,18 35,21" stroke={THEME.muted} strokeWidth="1.6" strokeLinecap="round" />
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
