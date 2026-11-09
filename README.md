# A & M Wedding Invitation Website (React + Vite + Tailwind CSS)

An elegant, modern single-page wedding invitation inspired by contemporary Thai & Korean minimalist luxury editorial design.

## Features & Architectural Structure

- **Hero Header**: Couple monogram initials emblem, editorial photo frame, bride & groom names, wedding date, venue tagline, and a live countdown timer.
- **Floating Ambient Audio**: Built-in zero-dependency procedural romantic acoustic music-box / piano melody generator (no external audio files required, no CORS errors, mobile-friendly audio unlock).
- **Our Story**: Alternating editorial photo & narrative milestone timeline.
- **Event Schedule & Itinerary**: Morning Ceremony (Khan Maak, Monk blessing, Water pouring) and Evening Reception & Party with **Add to Google Calendar** and **Download .ics (Apple Calendar)** support.
- **Curated Photo Gallery**: Responsive grid with hover zoom and accessible native `<dialog>` lightbox modal with arrow key navigation.
- **Dress Code & Color Swatches**: Editorial palette swatches with one-click hex copy toast feedback.
- **Location & Directions**: Interactive Google Maps embed, direct navigation links ("Open in Google Maps", "Apple Maps", "Call Venue", "Copy Address"), and valet / BTS shuttle info.
- **Interactive RSVP (Stateful)**: Client-side validation, guest count, dietary requirements, wishes, local storage persistence, confetti celebration, and an accessible confirmation modal.
- **Gift Registry & Bank Transfer**: Collapsible card with Thai PromptPay / Kasikorn & SCB bank transfer styling and instant copy-to-clipboard buttons.

## Project Structure

```
am-wedding/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css               # Typography, color tokens & dialog styles
│   ├── data/
│   │   └── weddingData.js      # All customizable couple info, dates, photos, & venue
│   ├── utils/
│   │   └── audioPlayer.js      # Procedural ambient wedding audio generator
│   └── components/
│       ├── AudioToggle.jsx     # Floating music player button
│       ├── Hero.jsx            # Monogram, countdown, & hero banner
│       ├── Story.jsx           # Milestone photo timeline
│       ├── Timeline.jsx        # Morning & Evening ceremony schedules
│       ├── Gallery.jsx         # Photo grid & dialog lightbox modal
│       ├── DressCode.jsx       # Theme & interactive color swatches
│       ├── Location.jsx        # Map embed & direction buttons
│       ├── RSVPForm.jsx        # Stateful RSVP form & confirmation dialog
│       ├── GiftRegistry.jsx    # Collapsible bank accounts & PromptPay
│       └── Footer.jsx          # Couple hashtag & credits
```

## How to Customize

All event information, couple names, photos, and accounts are cleanly separated in:
👉 [`src/data/weddingData.js`](file:///Users/ar677125/am-wedding/src/data/weddingData.js)

## Getting Started

```bash
# Run local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
