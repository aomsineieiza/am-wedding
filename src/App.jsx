import React from 'react';
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
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2926] selection:bg-[#C8B89E]/30 selection:text-[#2D2926]">
      {/* Floating Ambient Music Audio Player */}
      <AudioToggle />

      <main>
        {/* 1. Hero Header & Live Countdown */}
        <Hero />

        {/* 2. Our Story / Photo Moments */}
        <Story />

        {/* 3. Event Schedule & Timeline */}
        <Timeline />

        {/* 4. Curated Gallery & Lightbox Preview */}
        <Gallery />

        {/* 5. Dress Code & Color Palette Swatches */}
        <DressCode />

        {/* 6. Venue Location & Google Maps */}
        <Location />

        {/* 7. Interactive RSVP Form */}
        <RSVPForm />

        {/* 8. Wishes Wall / Guestbook */}
        <WishesWall />

        {/* 9. Gift Registry / Congratulatory Bank Account */}
        <GiftRegistry />
      </main>

      {/* 10. Footer with Monogram, Couple Hashtag, & RSVP Admin */}
      <Footer />

      {/* 11. Floating Quick Navigation Bar for Mobile */}
      <MobileNav />
    </div>
  );
}
