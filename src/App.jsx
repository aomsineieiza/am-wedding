import React, { useState } from 'react';
import EnvelopeIntro from './components/EnvelopeIntro';
import FastworkNavbar from './components/FastworkNavbar';
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#0074E2]/15 selection:text-[#0074E2]">
      {/* 1. Envelope Opening Screen (First view - Click to open website) */}
      {!hasOpenedEnvelope && (
        <EnvelopeIntro onOpen={() => setHasOpenedEnvelope(true)} />
      )}

      {/* 2. Fastwork-Style Morphing Floating Navbar */}
      <FastworkNavbar />

      {/* Floating Re-open Envelope Button */}
      {hasOpenedEnvelope && (
        <button
          type="button"
          onClick={() => setHasOpenedEnvelope(false)}
          className="fixed bottom-20 right-5 sm:bottom-6 sm:right-6 z-40 px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-medium text-slate-700 hover:text-[#0074E2] hover:border-[#0074E2] shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>✉️</span>
          <span>ซองจดหมาย</span>
        </button>
      )}

      <main>
        {/* 3. Hero Header & Live Countdown */}
        <Hero />

        {/* 4. Our Story / Photo Moments */}
        <Story />

        {/* 5. Event Schedule & Timeline */}
        <Timeline />

        {/* 6. Curated Gallery & Lightbox Preview */}
        <Gallery />

        {/* 7. Dress Code & Color Palette Swatches */}
        <DressCode />

        {/* 8. Venue Location & Google Maps */}
        <Location />

        {/* 9. Interactive RSVP Form */}
        <RSVPForm />

        {/* 10. Wishes Wall / Guestbook */}
        <WishesWall />

        {/* 11. Gift Registry / Congratulatory Bank Account & PromptPay */}
        <GiftRegistry />
      </main>

      {/* 12. Footer with Monogram, Couple Hashtag, & RSVP Admin */}
      <Footer />

      {/* 13. Floating Quick Navigation Bar for Mobile */}
      <MobileNav />
    </div>
  );
}
