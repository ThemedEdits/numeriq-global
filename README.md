# Numeriq Global — Website

A single-page website for **Numeriq Global**, a boutique financial services firm.

## Tech Stack
- Pure HTML5, CSS3, Vanilla JavaScript (no frameworks, no dependencies to install)
- Google Fonts: Cormorant Garamond + DM Sans
- Font Awesome 6 (CDN)
- Unsplash images (CDN, free)

## Project Structure
```
numeriq-global/
├── index.html          # Main HTML page
├── css/
│   └── style.css       # All styles, fully responsive
├── js/
│   └── main.js         # Interactivity, animations, form handling
├── vercel.json         # Vercel deployment config
└── README.md
```

## Features
- Animated preloader with hexagon SVG logo
- Sticky navbar with scroll detection & active link tracking
- Full-screen hero with parallax image + stat counters
- Tabbed services section (Reporting & Compliance / Accounting Operations)
- About, Why Us, Process (5-step), Testimonials sections
- Contact form with success state
- Custom gold cursor dot (desktop)
- Scroll-triggered reveal animations
- Back-to-top button
- Fully responsive for all screen sizes (360px → 1920px)

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
cd numeriq-global
vercel
```

### Option 2 — Vercel Dashboard (Drag & Drop)
1. Go to https://vercel.com/new
2. Drag the `numeriq-global` folder into the import area
3. Click Deploy

### Option 3 — GitHub
1. Push this folder to a GitHub repository
2. Import the repo on vercel.com
3. Vercel auto-detects static site — no build settings needed

## Customisation
- **Email / Phone**: Update in `index.html` → Contact section & Footer
- **Colors**: Edit CSS variables in `css/style.css` (`:root` block)
- **Logo**: Replace the inline SVG hex in `index.html` or swap with an `<img>`
- **Images**: Unsplash URLs can be replaced with hosted images
