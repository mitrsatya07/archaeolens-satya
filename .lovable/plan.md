# LensID — Camera-based Identifier for Plants, Animals & Minerals

A minimal, mobile-first web app. Point your phone or laptop camera at anything in nature — a plant, an animal, or a mineral/rock — and instantly get its scientific name, common name, names in major Indian languages, and a short authoritative summary with links to trusted scientific databases.

## What the user gets

1. **Open the app** → full-screen camera viewport with a single big "Identify" button.
2. **Point & tap** → captures the current frame (or upload from gallery as fallback if camera is blocked).
3. **Result card slides up** showing:
   - Category badge (Plant / Animal / Mineral)
   - **Scientific name** (e.g., *Mangifera indica*) — prominent
   - **Common English name** (e.g., Mango)
   - **Local names in major Indian languages**: Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati
   - **Short Wikipedia-style summary** (3–5 lines): family, habitat, key facts
   - **Confidence indicator** (High / Medium / Low) so users know when to double-check
   - **"Learn more" link buttons** to authoritative sources:
     - Wikipedia (always)
     - GBIF — for plants & animals (biodiversity)
     - IUCN Red List — for animals (conservation status)
     - Mindat — for minerals
     - Geological Survey of India search — for minerals (Indian context)
4. **"Identify another"** button → returns to camera.

No login. No saved history. No accounts. v1 stays minimal — just camera → result.

## How identification works (Hybrid approach)

1. The captured image is sent to a server function.
2. The server downscales the image to ~1024px (faster, cheaper) and sends it to a multimodal AI model via the Lovable AI Gateway.
3. The AI returns a structured response: category, scientific name, common name, local-language names, a short factual summary, and a confidence level.
4. The server then **deterministically constructs deep links** to authoritative databases using the scientific name (so the AI never fabricates URLs):
   - Wikipedia: `en.wikipedia.org/wiki/{Scientific_name}`
   - GBIF: species search by scientific name
   - IUCN: species search
   - Mindat: mineral search
   - GSI: site-scoped search query
5. The combined result is returned to the UI.

If the AI's confidence is **Low**, the result card shows a clear "Low confidence — please verify with the linked sources" notice.

## Authoritative-source policy

The AI provides the *identification and summary*, but every result ships with **direct links to authoritative scientific databases** so users can verify. This is the honest, accurate way to combine AI's broad coverage with real scientific authority.

## UI / UX

- **Mobile-first**, full-bleed camera viewport.
- Light, clean theme — easy reading outdoors. Soft white background, deep green accent for plants/animals, warm earth-brown accent for minerals.
- Big tap targets, single-purpose screens.
- Loading state shows a friendly "Analyzing…" with a subtle pulse on the captured thumbnail.
- Errors (camera blocked, no internet, AI rate limit) show a clear message with a retry option and a fallback "Upload from gallery" button.
- Works on Android Chrome, iOS Safari, and laptop browsers (uses the standard browser camera API, so no app store needed).

## Technical details

- **Stack**: TanStack Start (already set up), Tailwind, shadcn/ui.
- **Camera**: browser `getUserMedia` API with rear-camera preference on mobile; `<input type="file" capture>` fallback for iOS quirks and permission denials.
- **Image pipeline**: capture frame to canvas → downscale to max 1024px → JPEG at 0.85 quality → base64 for transport.
- **AI call**: `createServerFn` POST endpoint that calls Lovable AI Gateway with `google/gemini-2.5-flash` (multimodal, fast, cost-effective). Uses tool-calling for reliable structured JSON output (category, scientific name, common name, localNames object keyed by language, summary, confidence).
- **Authoritative links**: built server-side from the scientific name using URL templates — no AI URL fabrication.
- **Error handling**: server function returns typed `{ data, error }` shape; surfaces 429 (rate limit) and 402 (credits) as user-friendly toasts.
- **No database, no auth** in v1 — keeps the app instant to use and free of friction.

## Routes

- `/` — Camera + identification flow (single screen).
- `/about` — One short page explaining what the app does, the AI + authoritative-source approach, and a clear disclaimer that identifications are AI-assisted and should be verified for any critical use (foraging, medicinal, safety).

## Out of scope for v1 (can add later)

- History of past scans
- Favorites / collections
- Offline mode
- User accounts
- Audio identification (bird calls, etc.)
