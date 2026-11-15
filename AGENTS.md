# A & M Wedding Invitation Website (`am-wedding`) — Agent Guide

This repository is a modern, interactive single-page wedding invitation web application built with **React 19**, **Vite 8**, **Tailwind CSS v4**, **Framer Motion**, and **Lucide React**.

## 1. Tech Stack & Commands

- **Framework**: React 19 (`src/main.jsx`, `src/App.jsx`) + Vite (`vite.config.js`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` in `src/index.css`) with custom `@theme` tokens
- **Animations**: `framer-motion` (`motion`, `AnimatePresence`) & `canvas-confetti`
- **Icons**: `lucide-react`
- **Audio**: Zero-dependency Web Audio API synthesizer (`src/utils/audioPlayer.js`)

### Key Commands
- `npm install` — Install dependencies
- `npm run dev` — Start local development server at `http://localhost:5173`
- `npm run build` — Production build to `dist/` (run this to verify zero syntax/bundling errors after code changes)
- `npm run preview` — Preview production build locally

---

## 2. Architecture & File Map

```text
am-wedding/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx                        # Main page layout & 3D Envelope intro state
│   ├── index.css                      # Tailwind v4 @theme tokens, Google Sans, FigJam dot-grid
│   ├── data/
│   │   └── weddingData.js             # Single source of truth for all wedding content & config
│   ├── utils/
│   │   └── audioPlayer.js             # Procedural Web Audio API romantic music box
│   └── components/
│       ├── EnvelopeIntro.jsx          # 3D interactive envelope opening overlay
│       ├── FastworkNavbar.jsx         # Floating morphing top navigation + audio toggle
│       ├── MobileNav.jsx              # Floating bottom quick-navigation bar for mobile
│       ├── Hero.jsx                   # Couple banner, monogram, & live countdown timer
│       ├── Story.jsx                  # Couple narrative & milestone timeline
│       ├── Timeline.jsx               # Morning/Evening schedule + Google/Apple (.ics) calendar
│       ├── Gallery.jsx                # Photo grid + native <dialog> lightbox modal
│       ├── DressCode.jsx              # Color palette swatches + click-to-copy hex toast
│       ├── Location.jsx               # Google Maps embed, directions, & copy address
│       ├── RSVPForm.jsx               # Stateful RSVP form, validation, confetti, & <dialog>
│       ├── WishesWall.jsx             # FigJam sticky-note guestbook synced with localStorage
│       ├── GiftRegistry.jsx           # Collapsible bank accounts & PromptPay copy cards
│       ├── RSVPAdminModal.jsx         # Discreet modal in footer to view/export RSVPs as CSV
│       └── Footer.jsx                 # Couple monogram, hashtag, scroll-to-top, & admin trigger
```

---

## 3. Core Engineering Rules

1. **Data-Driven Content (`src/data/weddingData.js`)**:
   - Never hardcode couple names, wedding dates, venue addresses, schedule items, dress code colors, gallery URLs, or bank accounts inside UI components.
   - Always read from `weddingData` in `src/data/weddingData.js`.
2. **Design System & Visual Identity**:
   - **Theme**: Clean Fastwork / FigJam light mode canvas (`figjam-bg` radial dot-grid on `#F8FAFC`) with crisp white elevated cards (`rounded-3xl`, `border-slate-200`, subtle shadows).
   - **Primary Accent**: Fastwork Blue (`#0074E2`, hover `#0060B8`, subtle pill `#EBF4FE`, border `#C4DDFB`) paired with warm champagne/earth accents (`#C8B89E`, `#F4EFEB`).
   - **Typography**: `Google Sans` (`--font-sans`) across both Thai and English text.
   - **Bilingual Copy**: Keep UI headings, badges, and helper text harmonious in Thai + English (e.g., uppercase English pill badge + bold Thai heading + concise subtitle).
3. **Interactive Modals & Accessibility**:
   - Always use native HTML `<dialog>` elements (`showModal()`, `close()`, `closedby="any"`) for modals (Gallery lightbox, RSVP confirmation, RSVP Admin summary) instead of custom `div` portals.
   - Include `type="button"` on all non-submit `<button>` elements and `aria-label` on icon-only buttons.
4. **Client Persistence (`localStorage`)**:
   - RSVPs and Guestbook wishes share the `localStorage` key `'wedding_rsvps'`.
   - Entry shape: `{ fullName, contact, attending: 'yes' | 'no', guestCount, dietary, wishes, submittedAt }`.
   - Always wrap `localStorage.getItem` / `setItem` in `try / catch` blocks.
5. **Verification**:
   - After modifying any component or data file, run `npm run build` to verify there are no broken imports, JSX errors, or CSS issues.

