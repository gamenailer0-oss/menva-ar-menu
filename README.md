# Menu Magic

Build a complete, production-ready QR AR Menu SaaS web app called "MENVA" (Menu Innovation) with the tagline "Point. Discover. Devour." The app lets restaurant customers scan a QR code at their table and instantly see dishes come alive on their phone via AR, with photos, ingredients, chef stories, allergens, and a one-tap order/whatsapp message to the kitchen. The app also has a full restaurant-owner dashboard for managing menus, viewing analytics, and onboarding.

================================================

BRAND & EMOTIONAL FEEL

================================================

MENVA is not a tech app. MENVA is a chef's table experience that uses AR. Every screen should feel like a warm Italian trattoria meets a clean modern Tokyo kitchen. Warm, alive, premium-but-approachable, cheffy-not-cartoony, healthy, fresh. The user should feel they are about to eat something crafted with love. The restaurant owner should feel they run a smart, modern kitchen. Never sterile, never corporate, never generic SaaS.

Mascot: A small, friendly bespectacled chef character with one giant winking eye behind an AR monocle, holding a tiny fork, slightly tilted chef hat. Use this mascot as the empty-state illustration, the loading state, the welcome screen, and the 404 page. Cheffy is warm, never childish.

================================================

COLOR SYSTEM (use CSS variables, light theme primary, dark mode supported)

================================================

--saffron-50: #FBF1ED

--saffron-100: #F5DDD2

--saffron-300: #E8A48A

--saffron-500: #E76F51  (main brand)

--saffron-700: #C24E33

--charcoal-50: #F2F2F4

--charcoal-300: #8A8B9C

--charcoal-700: #3D405B  (main dark text)

--charcoal-900: #1F2030

--cream-50: #FDFCF8

--cream-100: #F4F1DE  (main background, parchment feel)

--cream-200: #E8E3D0

--mint-50: #E8F1EC

--mint-300: #B3D4C2

--mint-500: #81B29A  (healthy/fresh badge)

--mint-700: #5A8B76

--honey-100: #FAEDC9

--honey-500: #F2CC8F  (chef's special, premium badge)

--honey-700: #C9A55E

Rules: Never use pure black. Always charcoal-700. Backgrounds alternate between cream-100 and pure white for cards. CTAs are saffron-500 with white text. Fresh/healthy items get a mint-500 dot or pill. Chef's specials get a honey-500 pill with charcoal-700 text and a small chef hat icon.

================================================

TYPOGRAPHY

================================================

Headings: 'Fraunces' from Google Fonts, serif with personality, slightly variable. Use italic for dish names (chef's signature feel). Weights 400, 500, 600, 700. Tracking -0.02em on large sizes.

Body & UI: 'Inter' from Google Fonts. Weights 400, 500, 600. Generous line-height (1.6) for menu descriptions. Tracking +0.01em on small uppercase labels.

Hierarchy: H1 = Fraunces 600, 36-48px. H2 = Fraunces 500, 28-32px. Dish name = Fraunces italic 500, 22-26px. Price = Inter 600 tabular-nums, 18-20px. Body = Inter 400, 15-16px. Labels = Inter 500 uppercase tracking-widest, 11-12px.

================================================

SPACING & SHAPE

================================================

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Use generous whitespace, never cramped. Section padding 64-96px on desktop, 32-48px on mobile. Card padding 24px. Gap between cards 24px on desktop, 16px on mobile.

Border radius: 4px for tags, 12px for buttons/inputs, 20px for cards, 28px for hero/feature panels, full for avatars. Soft, generous corners. No sharp edges except on tiny labels.

Shadows: Subtle, warm, never harsh blue-grey. Use rgba(61, 64, 91, 0.08) for default, 0.12 for hover, 0.16 for floating elements. Never use Tailwind's default shadow-md/shadow-lg greys.

Borders: 1px solid rgba(61, 64, 91, 0.08) for cards, 0.12 for hover. No thick borders anywhere.

================================================

ANIMATION PHILOSOPHY

================================================

Subtle but felt. Every animation should feel like a chef's gentle gesture, not a tech demo. Use Framer Motion.

- Page transitions: fade + 8px y-translate, 350ms ease-out

- Cards on hover: 1.02 scale, -4px y, shadow deepens, 250ms

- Buttons: 0.97 scale on tap, 150ms

- Dish images on hover: 1.05 scale, slow ease-out 400ms

- AR scan: a saffron-500 horizontal line that sweeps top to bottom infinitely, with a soft saffron-100 glow, and a corner bracket frame that draws in on mount

- Numbers (prices, counts):

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c3a46d57-2df6-4bb8-9545-e8f1a50887f1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
