# Website Upgrade Plan

Scope is large — I'll deliver in 4 phases in one go.

## Phase 1 — Authentication & Cloud Sync for Field Notes

- Enable Email/Password + Google sign-in (Lovable managed OAuth, no setup needed)
- New `/auth` page (sign in / sign up tabs)
- Create `_authenticated/route.tsx` (integration-managed gate)
- Migration: `profiles` table + `field_notes` table with RLS (user-scoped)
- Field Notes page becomes hybrid: signed-out → localStorage; signed-in → cloud sync via server functions
- Header shows sign-in button / user menu (sign out)

## Phase 2 — Authentic Content & Citations

Add a structured `references` data module with full citation objects: `{ author, year, title, publication, publisher, url, type }`. Wire into every content page:

- **Sites directory**: each site gets ASI notification number, UNESCO inscription year/ref, lat/long, discoverer, primary excavator, key reports (e.g., Marshall 1931 for Mohenjo-daro)
- **Timeline**: each period cites foundational sources (e.g., Allchin & Allchin 1982, Chakrabarti 1999, Coningham & Young 2015)
- **Typology**: pottery wares cite Wheeler 1947 (NBPW), Lal 1954 (PGW); scripts cite Salomon 1998, Parpola 1994
- **Heritage Laws**: link to actual AMASR Act PDF on asi.nic.in, Antiquities Act 1972, official ASI reporting contacts
- **New `/references` page**: full bibliography (40+ entries) with DOI/URL links
- Inline footnote-style citation chips `[1]` on factual claims

## Phase 3 — Security Hardening

- **Input validation**: Zod schemas on Contact, Feedback, Field Notes forms (name/email/message length caps, type checks, sanitization)
- **Remove `dangerouslySetInnerHTML`** anywhere it exists
- **RLS audit**: every new table has user-scoped policies + GRANTs to authenticated/service_role only
- **HIBP password check** enabled on auth
- **mailto encoding**: `encodeURIComponent` everywhere
- Run security scan, address findings

## Phase 4 — UI/UX Polish

- Consistent page header component (breadcrumb + title + description) across all routes
- Unified card/section spacing using design tokens
- Better mobile nav (drawer)
- Accessibility: alt text audit, aria-labels on icon buttons, focus rings, semantic headings (single H1 per page)
- Loading skeletons for cloud-synced field notes
- Empty states with helpful CTAs

## Technical Notes

- Stack: TanStack Start + Supabase via Lovable Cloud
- New routes: `/auth`, `/references`, `_authenticated/field-notes` (moved)
- New tables: `profiles`, `field_notes` (with photo_url, lat, lng, category, notes)
- Server functions: `saveFieldNote`, `listFieldNotes`, `deleteFieldNote` (all `requireSupabaseAuth`)
- Field Notes migration helper: one-click "Upload local notes to cloud" after sign-in
- Validation lib: `zod` (already common in stack)

## Out of Scope

- Storage bucket for photos (Phase 1 keeps photos as base64 in DB with size cap; upgrade later if needed)
- Backend rate limiting (no primitive available; will skip per platform guidance)
- Marketing/SEO automation beyond per-page `head()` metadata

Approve and I'll build all 4 phases sequentially.