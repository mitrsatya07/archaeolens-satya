# Masthead par project ki asli start date

Homepage masthead me abhi "Est. MMXXVI · Vol. I" likha hai — sirf saal. Project actually **24 April 2026** ko shuru hua tha (pehla commit history isi din ka hai), to poori date Roman numerals me dikhegi.

## Change

`src/routes/index.tsx` (line 124) me masthead ki line:

- Abhi: `Est. MMXXVI · Vol. I`
- Naya: `Est. XXIV·IV·MMXXVI · Vol. I`

Baaki kuch nahi badlega — font, styling, layout, "Vol. I" sab waisa hi rahega.

## Technical notes

- Single-line text change in the masthead `<p className="small-caps text-muted-foreground">` of `src/routes/index.tsx`.
- Mobile par line thodi lambi hogi; existing `min-w-0 leading-none` wrapper isko handle kar leta hai, phir bhi 390px viewport par overflow check kar liya jayega.
