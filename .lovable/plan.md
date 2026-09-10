# MENVA v2 — a platform, not a restaurant

Today MENVA's home page acts like one restaurant's menu. It should be the platform: you open MENVA, browse fine dine-ins, pick one, and that restaurant's menu opens in *its own* theme — with the MENVA header above and "Powered by MENVA" below. The example restaurant is **Olmec**, a premium dessert bakery in a monochromatic green theme.

Work is grouped in five parts. Each part ends with a working app.

## 1. Platform structure

- **Home** becomes a MENVA landing + restaurant discovery page: hero, how it works, a curated row of dine-ins (Olmec featured, two or three more), regional leaderboard teaser, membership teaser.
- **Restaurants list** page: search, cuisine/region filter, cards with rating, region, MENVA rank.
- **Restaurant page** (`/r/olmec`): opens in the restaurant's own theme — Olmec = monochromatic greens, deep forest to pale sage, its own typeface pairing. Header stays MENVA (slim, neutral), footer reads "Powered by MENVA". Everything between belongs to the restaurant: hero, story, menu list, social handles, reviews, loyalty card.
- Osteria Lume stays as a second demo restaurant with its warm saffron theme, proving themes are per-restaurant.
- Theming is done with CSS variables scoped to a restaurant wrapper, so a restaurant's palette can't leak into MENVA chrome.

## 2. Fixing what's broken

- **Dish opening is slow** — the 3D viewer currently loads before the panel paints. Dish detail opens instantly with the photo, and the 3D model streams in behind a light shimmer; the model file is preloaded on hover/scroll-into-view.
- **"Place on your table" freezes / errors** — the current flow enters a WebXR session that never starts in the Lovable preview iframe (no camera permission there) and hard-errors on your phone. Rebuild:
  - iOS: an `rel="ar"` anchor to the USDZ served with the correct model type so Quick Look opens instead of downloading a zip file (that's exactly what your second screenshot shows).
  - Android: Scene Viewer intent link, plus in-page WebXR when the browser supports it.
  - Preview/desktop: no dead button — it shows "open on your phone" with a scannable code.
  - The AR page gets a proper MENVA-themed screen (dish name, plate, instructions, Cheffy cameo) instead of the blank one.
- **Signature burger looks pasted in** — reshoot its catalogue image so it matches the other dishes' plating, light and background. Under Olmec the signature becomes a dessert instead.
- **Buttons and scroll** — one shared button system, glossy Apple-style: soft gradient sheen, fine inner highlight, press squish, spring settle. Every clickable in the app gets a real destination and a press animation; smooth momentum scrolling with section reveals.

## 3. New sections and details

- Restaurant page gains: chef's note, hours, social handles (Instagram, TikTok, WhatsApp), Google reviews block with rating summary, and "book / visit" actions.
- **Loyalty**: each restaurant has a punch card styled to its own logo. Eight visits; day eight unlocks a surprise AR treat. Progress is remembered on the device for the demo.
- **Leaderboard**: regional ranking of restaurants by MENVA experience score, with diner rating and Google rating side by side. Filter by region.
- **Cheffy cameos**: peeking over a section edge on one page, drooling beside a dish on another, asleep in the footer. Small, never in the way, never a talking assistant.
- **Easter-egg hunt**: a light mini-game — find Cheffy's hidden cameos across the site; a discreet counter in the footer tracks how many of eight you've found, with a reward panel at the end.

## 4. MENVA Club

A rectangular band, deliberately unlike the rest of the site — dark, glossy, quiet — with half of Cheffy leaning in whispering *"want to be an exclusive member?"*. It links to `/club`.

The club page is a premium mirror of MENVA's own look: same colours, deeper, with metal and glass treatments.

**For diners** (shown first, they're the majority):
1. **MENVA Essential** — matte black card, everyday discounts and early access.
2. **MENVA Signature** — richer perks, priority tables, seasonal AR drops.
3. **MENVA Invite Only** — application-based, concierge, hidden menus.

**For restaurants** (below):
1. **MENVA Atelier**
2. **MENVA Maison**
3. **MENVA Sovereign** — invite only, and the holder earns the **MENVA Mark**, granted to a single restaurant per region, shown as a seal on their page and leaderboard row.

Each tier renders as a card object with its own material, not a pricing table box.

## 5. Polish pass

Consistent type scale, no leftover bordered boxes, motion on every interactive element, reduced-motion respected, per-page titles and share metadata, and a click-through of every button before finishing.

## Technical notes

- New routes: `/restaurants`, `/r/$slug`, `/r/$slug/dish/$dishId`, `/leaderboard`, `/club`. Existing `/menu` redirects to the Olmec restaurant page.
- Restaurant data model (`src/lib/restaurants.ts`): slug, name, region, theme tokens, logo, socials, google rating, dishes, loyalty config. Still demo data — no accounts or database in this pass.
- Theming: `data-theme` wrapper writing scoped CSS custom properties; MENVA chrome uses its own token layer.
- USDZ must be served as `model/vnd.usdz+zip` — the asset is currently `application/zip`, which is why iOS shows a zip file. Re-register the asset with the right content type and use `<a rel="ar">`.
- AR entry: capability detection first (`navigator.xr.isSessionSupported`, iOS Quick Look support), then route to WebXR / Quick Look / Scene Viewer / phone-handoff. No path leaves a spinner.
- GLB preloading via drei `useGLTF.preload`, model kept out of the first paint.
- Buttons: one `Button` variant set in `src/components/menva/ui.tsx` built on motion springs.
- Loyalty progress and easter-egg finds: `localStorage`, demo only.

## Not in this pass

Real accounts, payments for club tiers, live Google Reviews API, and restaurant self-serve signup remain demo-only. Say the word and Lovable Cloud can make loyalty, leaderboard and club membership real afterwards.
