import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import EnvelopeIntro from './components/EnvelopeIntro';
import FastworkNavbar from './components/FastworkNavbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import WeddingAlbum from './components/WeddingAlbum';
import DressCode from './components/DressCode';
import Location from './components/Location';
import RSVPForm from './components/RSVPForm';
import GiftRegistry from './components/GiftRegistry';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';

function WeddingContent() {
  const { lang, t } = useLanguage();
  // Always start with Envelope intro on page load/visit
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.removeItem('wedding_envelope_opened');
    } catch {
      // Ignore
    }
  }, []);

  const handleOpenEnvelope = () => {
    setHasOpenedEnvelope(true);
  };

  const handleReopenEnvelope = () => {
    setHasOpenedEnvelope(false);
  };

  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('wedding_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('wedding_theme', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden figjam-bg text-slate-900 dark:text-zinc-100 selection:bg-[#94AFC4]/25 selection:text-[#7A98B3] transition-colors duration-300">
      {/* 1. Envelope Opening Screen (First view - Click to open website) */}
      {!hasOpenedEnvelope && (
        <EnvelopeIntro onOpen={handleOpenEnvelope} />
      )}

      {/* 2. Fastwork-Style Morphing Floating Navbar */}
      <FastworkNavbar
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
      />

      {/* Floating Re-open Envelope Button (Visible on both mobile & desktop) */}
      {hasOpenedEnvelope && (
        <button
          type="button"
          onClick={handleReopenEnvelope}
          className="flex fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-40 px-3.5 py-2 rounded-full bg-white/90 dark:bg-[#1E2228]/90 backdrop-blur-md border border-slate-200 dark:border-[#323842] text-xs font-medium text-slate-700 dark:text-zinc-200 hover:text-[#7A98B3] hover:border-[#94AFC4] shadow-md transition-all cursor-pointer items-center gap-1.5 active:scale-95"
        >
          <span>✉️</span>
          <span>{t('nav.envelope', 'ซองจดหมาย')}</span>
        </button>
      )}

      <main>
        {/* 3. Hero Header & Live Countdown */}
        <Hero />

        {/* 4. Event Schedule & Timeline */}
        <Timeline />

        {/* 5. Dress Code & Color Palette Swatches */}
        <DressCode />

        {/* 6. Curated Gallery & Lightbox Preview */}
        <Gallery />

        {/* 6.5 Interactive Japanese & Korean Editorial Wedding Magazine Photobook */}
        <WeddingAlbum />

        {/* 8. Venue Location & Google Maps */}
        <Location />

        {/* 9. Interactive RSVP Form */}
        <RSVPForm />

        {/* 10. Gift Registry / Congratulatory Bank Account & PromptPay */}
        <GiftRegistry />
      </main>

      {/* 12. Footer with Monogram, Couple Hashtag, & RSVP Admin */}
      <Footer />

      {/* 13. Floating Quick Navigation Bar for Mobile */}
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <WeddingContent />
    </LanguageProvider>
  );
}
