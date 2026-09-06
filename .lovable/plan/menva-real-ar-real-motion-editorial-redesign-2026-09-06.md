# MENVA: real AR, real motion, editorial redesign

Three things are wrong today: the "AR" is only a photo with a moving line, every page is a grid of bordered boxes, and moving between pages happens with no transition. This plan fixes all three, starting with the two pages guests actually see.

## 1. A real scanner and a real 3D dish

**Scan screen** — a new full-screen page that asks for camera permission, shows the live camera with a framing reticle, and reads an actual QR code. Point it at a printed MENVA table code and it opens that table's menu. If the camera is blocked or unavailable, a short line explains why and offers a "browse the menu instead" link, plus a code-entry fallback.

**Dish in 3D** — opening a dish shows the plate as a real 3D object you can spin and pinch to zoom, lit like a restaurant table. On phones that support it, a "Place on my table" button drops the plate into the live camera view at real size. Where that isn't supported, the 3D viewer stays and the button is hidden rather than faked.

Dish models come from free, commercially usable 3D asset libraries; I'll source the closest match per dish (pasta bowl, salad bowl, seared scallops, tart). If a good model can't be found for one, that dish keeps a rich photo view and I'll tell you which one.

**Table QR codes** — the codes on the dashboard and onboarding pages become genuinely scannable images encoding the real table link, so the scanner and the printed sheet actually work together.

## 2. Killing the box look (home + menu first)

- No more uniform white cards with thin borders. Sections are separated by rhythm, colour fields and full-bleed imagery instead of outlines.
- Menu becomes an editorial list: large plate photography, generous whitespace, dish names in the display serif italic, prices in a quiet tabular figure, allergens as plain small caps text rather than chips.
- Home becomes a scroll story: full-bleed opening frame, an oversized statement line, three moments of the guest journey shown as staged imagery rather than icon boxes.
- One type system used everywhere: display serif for names and statements, sans for everything else. Emphasis comes from italic on dish names and chef quotes, and bold only on the single most important word in a line — no more decorative pill soup.
- Pricing, dashboard and onboarding get the same tokens and spacing pass afterwards so nothing looks left behind.

## 3. Motion that reads

- Page changes cross-fade and lift instead of snapping.
- Content sections reveal as you scroll, staggered, once.
- Dish opening becomes a continuous transition: the plate photo grows into the 3D viewer rather than a panel appearing over it.
- Buttons, filters and the order bar get consistent press and settle behaviour.
- All of it respects "reduce motion" settings.

## Scope

Menus, dishes and orders stay demo data as agreed — no accounts or saved data in this pass.

## Technical notes

- Scanner: `@zxing/browser` against `getUserMedia`, mounted on a client-only route (no server rendering of camera code).
- 3D: React Three Fiber + drei, `ssr: false` route/component, CC0 `.glb` assets committed under `public/models`, `<Suspense>` fallback to the dish photo.
- Placement in camera view: WebXR `immersive-ar` when `navigator.xr.isSessionSupported` resolves true; iOS gets AR Quick Look via a USDZ/`model-viewer` link where available, otherwise the button is not rendered.
- Page transitions: `motion/react` `AnimatePresence` keyed on router location in `__root.tsx`, plus a shared `useReveal` helper; everything wrapped in `useReducedMotion`.
- QR images generated with the `qrcode` package at render time from the table URL.
- Redesign tokens stay in `src/styles.css`; new utilities replace `card-warm` usage on home and menu.
