---
name: build-wedding-section
description: >-
  Use this skill when the user asks to create a new section, component, or
  interactive feature on the wedding invitation website, or significantly
  redesign an existing section in src/components/.
---

# Build or Update a Wedding Website Section

Use this workflow to create or modify sections in `src/components/` while keeping the Fastwork / FigJam visual language, bilingual Thai/English copy, and responsive navigation consistent.

## Steps

1. **Create or Edit the Component in `src/components/<ComponentName>.jsx`**:
   - Import data from `../data/weddingData` (add any new structured data fields to `src/data/weddingData.js` rather than hardcoding).
   - Wrap the section in `<section id="<section-slug>" className="py-20 sm:py-28 px-4 sm:px-6 bg-transparent">` so anchor navigation works smoothly.
   - Use the standard section header pattern:
     - Pill badge: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]`
     - Heading: `text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight`
     - Subtitle: `text-sm text-slate-500 mt-2 font-normal`
   - Use `framer-motion` (`initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`) for entrance animations.
   - For any modal/overlay, use a native `<dialog ref={dialogRef} closedby="any">` element.

2. **Mount the Section in [`src/App.jsx`](../../src/App.jsx)**:
   - Import the component and place it in `<main>` in logical chronological order (e.g., Hero → Story → Timeline → Gallery → DressCode → Location → RSVPForm → WishesWall → GiftRegistry).

3. **Update Navigation Bars (if the section should be in the menu)**:
   - Desktop navbar: Add `{ label: '<Thai Label>', href: '#<section-slug>' }` to `navLinks` in [`src/components/FastworkNavbar.jsx`](../../src/components/FastworkNavbar.jsx).
   - Mobile bottom bar (optional, max 5 items): Update `navItems` in [`src/components/MobileNav.jsx`](../../src/components/MobileNav.jsx) if requested.

4. **Verify Build**:
   - Run `npm run build` to confirm all imports, Lucide icons, and JSX compile cleanly.

