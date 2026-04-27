Plan to make the app lighter and fully archaeology-focused

1. Remove the heavy cyber/Hack-the-Box feel
- Replace neon grid, scanline animation, strong glow shadows, dense borders, and terminal-style labels with a clean field-documentation aesthetic.
- Use a lighter archaeological palette: parchment/sand background, clay/terracotta accents, charcoal text, subtle paper-like panels.
- Keep camera/photo capture simple and fast-looking: minimal overlay, no animated scanning effects, fewer translucent layers.

2. Change the whole product perspective to archaeology
- Make archaeology the default and primary mode.
- Remove the Nature Scan toggle and nature-focused homepage copy.
- Rename visible UI language from “LensID / scan / intel / signal” style to a professional archaeology tool tone, such as “ArchaeoLens”, “Field Record”, “Photo Observation”, and “Evidence Level”.
- Update metadata and descriptions in `src/routes/index.tsx`, `src/routes/about.tsx`, and `src/routes/__root.tsx` so the website is clearly about archaeological observation, not plants/animals/minerals.

3. Improve authenticity and realism of AI results
- Tighten the archaeology AI prompt so it never claims final authentication, exact dating, market value, legality, provenance, or certainty from an image alone.
- Require cautious wording: “possible”, “consistent with”, “not determinable from photograph”, and “requires stratigraphic/site context”.
- Ask the model to prioritize visible evidence only: material, form, breakage, surface treatment, manufacture marks, inscriptions, patina/weathering, measurements needed, and photo limitations.
- Make low/medium confidence more common unless the visible diagnostic features are strong.

4. Redesign the result card as a professional archaeological record
- Replace “confidence signal” with “Evidence level”.
- Emphasize: Object type, material, observed features, condition, possible chronology/cultural context, limitations, and recommended next documentation steps.
- Add a clear “Authenticity note” section explaining that true authentication requires context, lab/typological comparison, provenance, and expert review.
- Keep source links, but label them as “Research references” and frame them as places to compare typologies, not proof.

5. Update supporting pages
- Rewrite the About page around archaeological field workflow: photograph, observe, record, compare, verify.
- Replace plant/animal/mineral cards with archaeology categories: ceramics, lithics/tools, coins/metals, inscriptions/rock art, terracotta/sculptural fragments.
- Update limits and ethics: do not disturb sites, follow local heritage laws, consult professionals, record context and scale.

Technical notes
- Files to update: `src/components/CameraCapture.tsx`, `src/components/IdentifyResultCard.tsx`, `src/server/identify.functions.ts`, `src/routes/index.tsx`, `src/routes/about.tsx`, `src/routes/__root.tsx`, and `src/styles.css`.
- I will keep the existing camera/upload and export functionality.
- I will avoid database changes; this is a UI, copy, and AI-prompt refocus.
- After implementation, I will run a build/type check to catch JSX, import, and server-function syntax issues.