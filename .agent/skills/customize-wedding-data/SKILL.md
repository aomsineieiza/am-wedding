---
name: customize-wedding-data
description: >-
  Use this skill when the user wants to customize or update wedding details such
  as couple names, wedding date, countdown target, ceremony schedule, dress code
  color swatches, photo gallery images, venue location/map links, or bank/PromptPay
  gift registry accounts.
---

# Customize Wedding Data (`src/data/weddingData.js`)

All customizable wedding content lives in a single configuration file: [`src/data/weddingData.js`](../../src/data/weddingData.js).

## Steps

1. **Read [`src/data/weddingData.js`](../../src/data/weddingData.js)** to inspect the current `weddingData` object.
2. **Update the relevant section** following its required schema:
   - **`couple`**:
     - `bride`, `groom`, `brideFull`, `groomFull`, `initials` (e.g. `"A & M"`), `hashtag`
     - `date`: Must be a valid ISO 8601 timestamp with timezone (e.g. `"2027-01-23T09:09:00+07:00"`) — used by the live countdown timer in `Hero.jsx` and calendar generators in `Timeline.jsx`.
     - `dateFormatted` (English display string) & `thaiDateFormatted` (Thai display string).
   - **`venue`**:
     - `name`, `hall`, `city`, `thaiCity`, `address`, `thaiAddress`, `phone`, `phoneDisplay`
     - `googleMapsUrl`, `appleMapsUrl`, `mapEmbedUrl` (iframe `src` URL), `parkingInfo`
   - **`schedule`**:
     - Array of ceremony periods (`id`, `period`, `periodThai`, `time`, `venueRoom`, `dressCodeNote`, and `items: [{ time, title, desc }]`).
   - **`dressCode`**:
     - `title`, `subtitle`, `description`, `note`
     - `palette`: Array of `{ name, hex, textDark }` where `hex` is a valid 6-digit hex color (e.g. `"#F4EFEB"`) and `textDark` is a boolean controlling label contrast on the swatch.
   - **`gallery`**:
     - Array of `{ id, title, caption, src, aspect }` where `aspect` is `"tall"`, `"wide"`, or `"square"`.
   - **`bankAccounts`**:
     - Array of `{ bank, bankThai, accountNumber, cleanNumber, accountName, promptPay, color }` where `cleanNumber` contains digits only for one-click clipboard copy.
3. **Check for hardcoded references** if the wedding date or RSVP deadline changed:
   - Check `src/components/EnvelopeIntro.jsx` footer date string and `src/components/RSVPForm.jsx` RSVP deadline subtitle if the wedding date was changed.
4. **Validate the changes**:
   - Run `npm run build` to ensure there are no syntax errors in `weddingData.js` or importing components.

