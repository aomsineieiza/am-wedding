import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { weddingAudio } from '../utils/audioPlayer';

// Rotating Romantic Easter Egg Wedding Code Snippets
const WEDDING_CODE_SNIPPETS = [
  // 1. Kotlin / Jetpack Compose
  [
    [{ text: '@Composable', color: 'text-[#C27850]' }],
    [
      { text: 'fun ', color: 'text-[#9D7CD8]' },
      { text: 'ForeverTogether', color: 'text-[#5B86E5]' },
      { text: '(', color: 'text-[#64748B]' }
    ],
    [
      { text: '  modifier', color: 'text-[#526477]' },
      { text: ': ', color: 'text-[#94A3B8]' },
      { text: 'Modifier', color: 'text-[#4A72B2]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: 'Modifier', color: 'text-[#4A72B2]' }
    ],
    [{ text: ') {', color: 'text-[#64748B]' }],
    [
      { text: '  val ', color: 'text-[#9D7CD8]' },
      { text: 'love', color: 'text-[#475569]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: 'remember', color: 'text-[#9D7CD8]' },
      { text: ' { ', color: 'text-[#94A3B8]' },
      { text: 'mutableStateOf', color: 'text-[#5B86E5]' },
      { text: '(', color: 'text-[#94A3B8]' },
      { text: 'true', color: 'text-[#9D7CD8]' },
      { text: ') }', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '  if ', color: 'text-[#9D7CD8]' },
      { text: '(', color: 'text-[#94A3B8]' },
      { text: 'love', color: 'text-[#475569]' },
      { text: '.', color: 'text-[#94A3B8]' },
      { text: 'value', color: 'text-[#526477]' },
      { text: ') {', color: 'text-[#64748B]' }
    ],
    [
      { text: '    ', color: 'text-[#94A3B8]' },
      { text: 'Together', color: 'text-[#5B86E5]' },
      { text: '(', color: 'text-[#64748B]' }
    ],
    [
      { text: '      groom', color: 'text-[#526477]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: '"Aomsin"', color: 'text-[#4E9A74]' },
      { text: ',', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '      bride', color: 'text-[#526477]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: '"Mild"', color: 'text-[#4E9A74]' },
      { text: ',', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '      forever', color: 'text-[#526477]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: 'true', color: 'text-[#9D7CD8]' }
    ],
    [{ text: '    )', color: 'text-[#64748B]' }],
    [{ text: '  }', color: 'text-[#64748B]' }],
    [{ text: '}', color: 'text-[#64748B]' }]
  ],

  // 2. React / TypeScript
  [
    [
      { text: 'interface ', color: 'text-[#9D7CD8]' },
      { text: 'WeddingVows', color: 'text-[#4A72B2]' },
      { text: ' {', color: 'text-[#64748B]' }
    ],
    [
      { text: '  groom', color: 'text-[#526477]' },
      { text: ': ', color: 'text-[#94A3B8]' },
      { text: '"Aomsin"', color: 'text-[#4E9A74]' },
      { text: ';', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '  bride', color: 'text-[#526477]' },
      { text: ': ', color: 'text-[#94A3B8]' },
      { text: '"Mild"', color: 'text-[#4E9A74]' },
      { text: ';', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '  date', color: 'text-[#526477]' },
      { text: ': ', color: 'text-[#94A3B8]' },
      { text: '"2027-01-23"', color: 'text-[#4E9A74]' },
      { text: ';', color: 'text-[#94A3B8]' }
    ],
    [{ text: '}', color: 'text-[#64748B]' }],
    [
      { text: 'const ', color: 'text-[#9D7CD8]' },
      { text: 'OurJourney', color: 'text-[#5B86E5]' },
      { text: ': ', color: 'text-[#94A3B8]' },
      { text: 'React.FC', color: 'text-[#4A72B2]' },
      { text: ' = () => {', color: 'text-[#64748B]' }
    ],
    [
      { text: '  const ', color: 'text-[#9D7CD8]' },
      { text: '[happiness]', color: 'text-[#475569]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: 'useState', color: 'text-[#5B86E5]' },
      { text: '(', color: 'text-[#94A3B8]' },
      { text: 'Infinity', color: 'text-[#4A72B2]' },
      { text: ');', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '  useEffect', color: 'text-[#5B86E5]' },
      { text: '(() => {', color: 'text-[#64748B]' }
    ],
    [
      { text: '    heart.', color: 'text-[#526477]' },
      { text: 'bind', color: 'text-[#5B86E5]' },
      { text: '(', color: 'text-[#94A3B8]' },
      { text: '"Thitikorn"', color: 'text-[#4E9A74]' },
      { text: ', ', color: 'text-[#94A3B8]' },
      { text: '"Kewalin"', color: 'text-[#4E9A74]' },
      { text: ');', color: 'text-[#94A3B8]' }
    ],
    [{ text: '  }, []);', color: 'text-[#64748B]' }],
    [
      { text: '  return <', color: 'text-[#64748B]' },
      { text: 'Love ', color: 'text-[#4A72B2]' },
      { text: 'forever', color: 'text-[#526477]' },
      { text: '={', color: 'text-[#94A3B8]' },
      { text: 'true', color: 'text-[#9D7CD8]' },
      { text: '} />;', color: 'text-[#64748B]' }
    ],
    [{ text: '};', color: 'text-[#64748B]' }]
  ],

  // 3. Python Async
  [
    [
      { text: 'async def ', color: 'text-[#9D7CD8]' },
      { text: 'celebrate_wedding', color: 'text-[#5B86E5]' },
      { text: '():', color: 'text-[#64748B]' }
    ],
    [
      { text: '    groom', color: 'text-[#526477]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: '"Aomsin"', color: 'text-[#4E9A74]' }
    ],
    [
      { text: '    bride', color: 'text-[#526477]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: '"Mild"', color: 'text-[#4E9A74]' }
    ],
    [
      { text: '    date', color: 'text-[#526477]' },
      { text: ' = ', color: 'text-[#94A3B8]' },
      { text: '"2027-01-23"', color: 'text-[#4E9A74]' }
    ],
    [
      { text: '    while ', color: 'text-[#9D7CD8]' },
      { text: 'True', color: 'text-[#9D7CD8]' },
      { text: ':', color: 'text-[#64748B]' }
    ],
    [
      { text: '        await ', color: 'text-[#9D7CD8]' },
      { text: 'love', color: 'text-[#475569]' },
      { text: '.', color: 'text-[#94A3B8]' },
      { text: 'grow', color: 'text-[#5B86E5]' },
      { text: '()', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '        await ', color: 'text-[#9D7CD8]' },
      { text: 'cherish_every_moment', color: 'text-[#5B86E5]' },
      { text: '()', color: 'text-[#94A3B8]' }
    ],
    [
      { text: '        if ', color: 'text-[#9D7CD8]' },
      { text: 'today >= date:', color: 'text-[#526477]' }
    ],
    [
      { text: '            happily_ever_after = ', color: 'text-[#526477]' },
      { text: 'True', color: 'text-[#9D7CD8]' }
    ]
  ]
];

function CodeTypingBg({ isOpening }) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const currentSnippet = WEDDING_CODE_SNIPPETS[snippetIndex];

  const totalChars = useMemo(() => {
    return currentSnippet.reduce((sum, line) => {
      const lineLen = line.reduce((acc, token) => acc + token.text.length, 0);
      return sum + lineLen + 1; // +1 for newline
    }, 0);
  }, [currentSnippet]);

  useEffect(() => {
    let timeoutId;
    let count = 0;
    setCharCount(0);
    setIsFading(false);

    const typeNext = () => {
      if (isOpening) return;
      if (count < totalChars) {
        count += 1;
        setCharCount(count);
        // Slower, graceful typing cadence (60ms - 95ms)
        const delay = 60 + Math.floor(Math.random() * 35);
        timeoutId = setTimeout(typeNext, delay);
      } else {
        // finished typing, pause for 7.5s, then fade out and switch snippet
        timeoutId = setTimeout(() => {
          setIsFading(true);
          timeoutId = setTimeout(() => {
            setSnippetIndex((prev) => (prev + 1) % WEDDING_CODE_SNIPPETS.length);
          }, 600); // 600ms fade transition
        }, 7500);
      }
    };

    if (!isOpening) {
      timeoutId = setTimeout(typeNext, 700);
    }
    return () => clearTimeout(timeoutId);
  }, [snippetIndex, totalChars, isOpening]);

  let budget = charCount;
  let cursorRendered = false;

  return (
    <div
      aria-hidden="true"
      className={`absolute left-3 sm:left-6 lg:left-14 xl:left-20 top-14 sm:top-20 md:top-24 z-0 pointer-events-none select-none font-mono text-[10px] sm:text-[12px] md:text-[13px] leading-[1.62] transition-opacity duration-500 ${
        isOpening || isFading
          ? 'opacity-0'
          : 'opacity-25 sm:opacity-35 md:opacity-45'
      }`}
    >
      <div className="flex flex-col">
        {currentSnippet.map((line, lineIdx) => {
          return (
            <div key={lineIdx} className="whitespace-pre flex items-center min-h-[1.62em]">
              {line.map((token, tokenIdx) => {
                if (budget <= 0) return null;
                const tokenLen = token.text.length;
                const sliceLen = Math.min(budget, tokenLen);
                const textSlice = token.text.slice(0, sliceLen);
                budget -= sliceLen;

                const isCursorHere = budget === 0 && !cursorRendered;
                if (isCursorHere) cursorRendered = true;

                return (
                  <span key={tokenIdx} className={token.color}>
                    {textSlice}
                    {isCursorHere && (
                      <span className="inline-block w-[6px] sm:w-[7px] h-[1.15em] ml-0.5 bg-[#5B86E5] align-middle animate-pulse rounded-2xs" />
                    )}
                  </span>
                );
              })}
              {budget > 0 ? (budget -= 1, null) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EnvelopeIntro({ onOpen }) {
  const { couple, venue } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Dynamic vertical centering for mobile Figma cursor between envelope and bottom prompt
  const envelopeBoxRef = useRef(null);
  const bottomPromptRef = useRef(null);
  const [cursorBottomPx, setCursorBottomPx] = useState(null);

  useEffect(() => {
    const updateCursorPosition = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        if (envelopeBoxRef.current && bottomPromptRef.current) {
          const envRect = envelopeBoxRef.current.getBoundingClientRect();
          const promptRect = bottomPromptRef.current.getBoundingClientRect();
          const envBottom = envRect.bottom;
          const promptTop = promptRect.top;
          if (promptTop > envBottom) {
            const midY = (envBottom + promptTop) / 2;
            const bottomDist = window.innerHeight - midY - 12;
            setCursorBottomPx(Math.max(55, Math.round(bottomDist)));
            return;
          }
        }
      }
      setCursorBottomPx(null);
    };

    updateCursorPosition();
    window.addEventListener('resize', updateCursorPosition);
    const t1 = setTimeout(updateCursorPosition, 100);
    const t2 = setTimeout(updateCursorPosition, 450);
    return () => {
      window.removeEventListener('resize', updateCursorPosition);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen, isOpening]);

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
          exit={{ opacity: 0, scale: 1.03 }}
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

          {/* Jetpack Compose Background Code Typing Animation */}
          <CodeTypingBg isOpening={isOpening} />

          {/* FigJam Board Top-Left Section Pill */}
          <div className="relative z-30 pt-2 sm:pt-4 flex items-center justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-xs text-[11px] sm:text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#7A98B3]" />
              <span>{couple.groom} &amp; {couple.bride} — Wedding Invitation Board</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono">
                23.01.2027
              </span>
            </div>
          </div>

          {/* ===============================================================
              FIGMA COLLABORATIVE MULTIPLAYER CURSOR ("AMWedding")
             =============================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10, y: 10 }}
            animate={
              isOpening
                ? { opacity: 0, scale: 0.6, y: 20 }
                : {
                    opacity: 1,
                    scale: 1,
                    x: [0, 18, 8, -14, 4, 0],
                    y: [0, -14, 8, -10, 4, 0],
                  }
            }
            transition={
              isOpening
                ? { duration: 0.3 }
                : {
                    opacity: { duration: 0.5, delay: 0.2 },
                    scale: { duration: 0.5, delay: 0.2 },
                    x: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            className={`absolute ${cursorBottomPx !== null ? '' : 'bottom-[19%]'} sm:bottom-[13%] md:bottom-[15%] right-[6%] sm:right-[12%] md:right-[16%] z-30 pointer-events-none select-none flex items-start transition-[bottom] duration-150`}
            style={{
              bottom: cursorBottomPx !== null ? `${cursorBottomPx}px` : undefined,
            }}
          >
            {/* Figma Cursor Arrow Tip */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] shrink-0"
            >
              <path
                d="M 0.5 0.5 L 6.5 15.5 L 9 9.5 L 15.5 7 Z"
                fill="#0074E2"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>

            {/* Figma Tag Name Pill */}
            <div className="-ml-0.5 mt-2.5 px-2.5 py-0.5 rounded-md rounded-tl-none bg-[#0074E2] text-white text-[11px] sm:text-xs font-semibold tracking-wide shadow-md whitespace-nowrap">
              AMWedding
            </div>
          </motion.div>

          {/* ===============================================================
              CENTER SHOWCASE ENVELOPE ASSEMBLY (Tilted like Reference Image)
             =============================================================== */}
          <div className="relative my-auto z-20 flex flex-col items-center justify-center pt-[180px] sm:pt-[220px] md:pt-[245px] scale-[0.88] min-[390px]:scale-95 sm:scale-95 lg:scale-100 transition-transform">
            <motion.div
              ref={envelopeBoxRef}
              initial={{ opacity: 0, y: 24, rotate: -3.5, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: isOpening ? 28 : 0,
                rotate: -3.5,
                scale: isExiting ? 1.12 : 1,
              }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[320px] sm:w-[380px] md:w-[420px] h-[235px] sm:h-[275px] md:h-[300px] z-20"
              style={{ perspective: 1400 }}
            >
              {/* 0. 3D CARTOON BRIDE & GROOM SITTING ON TOP FLAP (Matches User Mockup) */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{
                  opacity: isOpening ? 0 : 1,
                  y: isOpening ? -20 : 0,
                  scale: isOpening ? 0.94 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[80%] sm:bottom-[82%] md:bottom-[83%] left-[45%] sm:left-[46%] -translate-x-1/2 w-[275px] sm:w-[315px] md:w-[345px] z-40 pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 20px 24px rgba(15, 23, 42, 0.11))',
                }}
              >
                <img
                  src="/images/cartoon-couple.png?v=2"
                  alt="Aomsin & Mild 3D Cartoon"
                  decoding="async"
                  loading="eager"
                  className="w-full h-auto object-contain select-none pointer-events-none"
                  draggable="false"
                />
              </motion.div>
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

            {/* 2. TOP POINTED TRIANGULAR FLAP (Original Proportions) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isOpening ? 180 : 0 }}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
              }}
              className={`absolute inset-x-0 top-0 h-[62%] pointer-events-none ${
                flapBehind ? 'z-[5]' : 'z-[35]'
              }`}
            >
              <div
                className="w-full h-full"
                style={{
                  filter: isOpening
                    ? 'drop-shadow(0 -8px 18px rgba(15, 23, 42, 0.14))'
                    : 'drop-shadow(0 6px 12px rgba(15, 23, 42, 0.12))',
                }}
              >
                <svg viewBox="0 0 400 220" preserveAspectRatio="none" className="w-full h-full">
                  {/* Outer Pointed Triangle Flap */}
                  <path
                    d="M 0,0 L 400,0 L 218,198 Q 200,214 182,198 Z"
                    fill="#C4E0EA"
                    stroke="#A7C7D4"
                    strokeWidth="2"
                  />
                  {/* Inner Embossed Triangle Rim Line */}
                  <path
                    d="M 18,6 L 382,6 L 212,184 Q 200,196 188,184 Z"
                    fill="none"
                    stroke="#DCEEF4"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </motion.div>

            {/* 3. KOREAN DIE-CUT INVITATION CARD (Matches Website Hero Card) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ clipPath: 'polygon(-50% -300%, 150% -300%, 150% 100%, -50% 100%)' }}
            >
              <motion.div
                initial={{ y: 0, rotate: 0, scale: 0.96, opacity: 0.96 }}
                animate={
                  isOpening
                    ? { y: -105, rotate: 0, scale: 1.02, opacity: 1 }
                    : { y: -8, rotate: 0, scale: 0.98, opacity: 0.98 }
                }
                transition={{
                  duration: 0.85,
                  delay: isOpening ? 0.22 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-x-3.5 sm:inset-x-6 top-3 sm:top-3.5 h-[210px] sm:h-[250px] md:h-[270px] bg-[#FAFAFB] rounded-[22px] sm:rounded-[30px] border border-[#E2E5E9] shadow-xl flex flex-col items-center justify-between py-2.5 sm:py-3.5 px-3 sm:px-6 text-center overflow-hidden"
              >
                {/* Subtle Inner Embossed Card Frame Line */}
                <div className="absolute inset-1.5 sm:inset-2.5 rounded-[16px] sm:rounded-[24px] border border-[#EFF1F3] pointer-events-none" />

                {/* 1. Spaced-Out Minimalist Couple Names + Solid Tiny Heart */}
                <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2.5 text-[#27272A] text-[9px] sm:text-xs font-medium tracking-[0.32em] uppercase pl-[0.32em]">
                  <span>{couple.groom}</span>
                  <span className="text-[7px] sm:text-[9px] text-[#27272A] tracking-normal">♥</span>
                  <span>{couple.bride}</span>
                </div>

                {/* 2. Recessed Oval / Capsule Die-Cut Window Frame */}
                <div className="relative z-10 flex flex-col items-center my-auto">
                  <div className="diecut-window-outer rounded-full p-1 sm:p-2 w-[72px] sm:w-[98px] md:w-[110px] aspect-[3/4.1] flex items-center justify-center relative shadow-xs">
                    <div className="w-full h-full rounded-full p-0.5 border border-[#E5E7EB] bg-[#F4F5F7] flex items-center justify-center">
                      <div className="diecut-window-inner w-full h-full rounded-full overflow-hidden relative bg-[#E5E7EB]">
                        <img
                          src={couple.heroImage}
                          alt={`${couple.groom} and ${couple.bride}`}
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_6px_rgba(15,23,42,0.14)] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 5 Dots Indicator: ● ● ▬ ● ● */}
                  <div className="flex items-center justify-center gap-1 mt-1 sm:mt-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#D4D8DD]" />
                    <span className="w-1 h-1 rounded-full bg-[#D4D8DD]" />
                    <span className="w-3 sm:w-3.5 h-1 rounded-full bg-[#7FA6B5]" />
                    <span className="w-1 h-1 rounded-full bg-[#D4D8DD]" />
                    <span className="w-1 h-1 rounded-full bg-[#D4D8DD]" />
                  </div>
                </div>

                {/* 3. Blind-Embossed Airplane Motif & Vertical Caption */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="blind-emboss mb-0.5 opacity-75" aria-hidden="true">
                    <svg viewBox="0 0 32 32" className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#8E9CA8] -rotate-12">
                      <path d="M28.5 4.5L3.5 14.2c-1 .4-1 1.8.1 2.1l6.4 2 11.8-9.3c.4-.3.9.2.5.6l-9.6 10.5v5.6c0 1.1 1.3 1.6 2 .8l3.3-3.8 5.2 3.8c.8.6 2 .1 2.2-.9L29.9 6c.2-1.1-.5-1.9-1.4-1.5z" />
                    </svg>
                  </div>

                  {/* Vertical Spaced Minimalist Korean Text */}
                  <div className="flex flex-col items-center space-y-0.5 text-[#27272A] text-[8px] sm:text-[10px] font-normal leading-none py-0.5">
                    <span>결</span>
                    <span>혼</span>
                    <span>합</span>
                    <span>니</span>
                    <span>다</span>
                  </div>

                  <p className="text-[8px] sm:text-[10px] md:text-[11px] text-[#52525B] font-medium tracking-[0.16em] uppercase mt-1">
                    WE ARE GETTING MARRIED
                  </p>
                  <p className="text-[7px] sm:text-[8px] text-[#71717A] font-light mt-0.5 max-w-[190px] sm:max-w-xs leading-tight italic truncate">
                    &ldquo;{couple.quote}&rdquo;
                  </p>
                </div>
              </motion.div>
            </div>

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
                    fontFamily="'Google Sans', sans-serif"
                    fontWeight="bold"
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
                    alt={`${couple.groom} & ${couple.bride} Stamp`}
                    decoding="async"
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

                <div className="font-parisienne text-3xl sm:text-5xl md:text-[56px] text-slate-950 leading-[1.05] tracking-normal mt-1 sm:mt-1.5 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
                  {couple.groom} &amp; {couple.bride}!
                </div>
              </div>
            </div>
          </motion.div>
        </div>

          {/* Bottom Prompt (Only shown before tapping) */}
          <div className="relative z-30 pb-3 sm:pb-5 flex flex-col items-center text-center min-h-[44px]">
            {!isOpening && (
              <motion.div
                ref={bottomPromptRef}
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
