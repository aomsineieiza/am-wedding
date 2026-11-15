# UI, Styling, and Code Conventions (`am-wedding`)

Follow these rules whenever writing or updating code in this project.

## 1. Styling & Tailwind CSS v4 Tokens

- **Tailwind v4 Setup**: Configured via `@import "tailwindcss";` and `@theme` in `src/index.css`. Do not create a legacy `tailwind.config.js`.
- **Color Palette**:
  - Primary brand blue: `bg-[#0074E2]`, `hover:bg-[#0060B8]`, `text-[#0074E2]`
  - Subtle blue badge/surface: `bg-[#EBF4FE]`, `border-[#C4DDFB]`, `text-[#0074E2]`
  - Card surfaces: `bg-white`, `border border-slate-200`, `rounded-3xl`, `shadow-md shadow-slate-900/5`
  - Text hierarchy: Headings `text-slate-900 font-bold tracking-tight`, body `text-slate-600`, muted captions `text-slate-500` or `text-slate-400`.
- **Section Layout Pattern**:
  Every major section in `src/components/` should use consistent spacing and header hierarchy:
  ```jsx
  <section id="section-id" className="py-20 sm:py-28 px-4 sm:px-6 bg-transparent">
    <div className="max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]">
          <span>BADGE TITLE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          หัวข้อภาษาไทย
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-normal">
          คำอธิบายย่อย...
        </p>
      </div>
      {/* Section Content */}
    </div>
  </section>
  ```

## 2. Animation Guidelines (`framer-motion`)

- Use `whileInView={{ opacity: 1, y: 0 }}` with `initial={{ opacity: 0, y: 20 }}` and `viewport={{ once: true }}` for scroll-reveal elements so animations play smoothly once without jarring re-triggers.
- Use smooth cubic-bezier easing (`[0.16, 1, 0.3, 1]` or `duration: 0.5–0.6`) for cards and modals.
- Keep hover micro-interactions subtle (`hover:-translate-y-0.5` or `hover:scale-[1.02]`, `cursor-pointer`).

## 3. State & Browser APIs

- **Clipboard**: Use `navigator.clipboard.writeText(...)` with a temporary state flag (`copied`, reset after `2000ms` via `setTimeout`) to show visual confirmation feedback.
- **Audio (`src/utils/audioPlayer.js`)**: Never auto-play audio on initial page load before user interaction. Trigger `weddingAudio.play()` inside user click handlers (such as `EnvelopeIntro` or `FastworkNavbar` toggle).
- **RSVP & Guestbook Storage**: Both `RSVPForm.jsx`, `WishesWall.jsx`, and `RSVPAdminModal.jsx` read/write the `wedding_rsvps` array in `localStorage`. Keep field names backward-compatible (`fullName`, `contact`, `attending`, `guestCount`, `dietary`, `wishes`, `submittedAt`).

