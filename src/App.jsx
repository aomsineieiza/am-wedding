import React, { useState } from 'react';
import EnvelopeIntro from './components/EnvelopeIntro';
import AudioToggle from './components/AudioToggle';
import Hero from './components/Hero';
import Story from './components/Story';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import DressCode from './components/DressCode';
import Location from './components/Location';
import RSVPForm from './components/RSVPForm';
import WishesWall from './components/WishesWall';
import GiftRegistry from './components/GiftRegistry';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';

export default function App() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2926] selection:bg-[#C8B89E]/30 selection:text-[#2D2926]">
      {/* 1. Envelope Opening Screen (First view - Click to open website) */}
      {!hasOpenedEnvelope && (
        <EnvelopeIntro onOpen={() => setHasOpenedEnvelope(true)} />
      )}

      {/* Floating Ambient Music Audio Player */}
      <AudioToggle />

      {/* Floating Re-open Envelope Button */}
      {hasOpenedEnvelope && (
        <button
          type="button"
          onClick={() => setHasOpenedEnvelope(false)}
          className="fixed top-5 left-5 z-40 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E2D8] text-[11px] font-serif text-[#6B635B] hover:text-[#2D2926] hover:border-[#C8B89E] shadow-sm transition-all"
        >
          ✉️ ซองจดหมาย • Envelope
        </button>
      )}

      <main>
        {/* 2. Hero Header & Live Countdown */}
        <Hero />

        {/* 3. Our Story / Photo Moments */}
        <Story />

        {/* 4. Event Schedule & Timeline with Thai Wedding Illustrated Icons */}
        <Timeline />

        {/* 5. Curated Gallery & Lightbox Preview */}
        <Gallery />

        {/* 6. Dress Code & Color Palette Swatches + RSVP Prompt */}
        <DressCode />

        {/* 7. Venue Location & Google Maps */}
        <Location />

        {/* 8. Interactive RSVP Form */}
        <RSVPForm />

        {/* 9. Wishes Wall / Guestbook */}
        <WishesWall />

        {/* 10. Gift Registry / Congratulatory Bank Account & PromptPay */}
        <GiftRegistry />
      </main>

      {/* 11. Footer with Monogram, Couple Hashtag, & RSVP Admin */}
      <Footer />

      {/* 12. Floating Quick Navigation Bar for Mobile */}
      <MobileNav />
    </div>
  );
}
