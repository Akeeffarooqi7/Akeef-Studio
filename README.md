# Akeef · Studio — Portfolio Site

> Studio of code, craft & intelligence.
> A personal portfolio for **Akeef Farooqi** — developer, AI builder and web architect — designing premium digital products for founders, ateliers and ambitious brands.

**Live site:** [akeef.studio](https://akeef.studio/)

---

## ✨ Overview

This is a single-page, art-directed portfolio site built from scratch with hand-written **HTML, CSS and JavaScript** — no frameworks, no build step, no bloat. It showcases the studio's services, process, selected work and a working contact form.

The site is engineered to feel like a **luxury hospitality brand** rather than a typical developer portfolio: quiet typography, slow motion, considered spacing and an editorial color palette (ink, gold, parchment).

---

## 🧩 Sections

| # | Section | Purpose |
|---|---|---|
| 01 | **Hero** | Animated title rotator, brand statement, primary CTAs |
| 02 | **About** | Studio philosophy + three pillars (Web · Product · AI) |
| 03 | **Process** | A six-chapter timeline from Discovery → Launch & Care |
| 04 | **Work** | Filterable grid of live projects (Luxury · Product · Travel) |
| 05 | **In Motion** | Animated browser + terminal mock showing build → deploy |
| 06 | **Services** | Bento grid of offers with transparent pricing in INR |
| 07 | **Let's Build** | CTA interlude with email + social pill |
| 08 | **Skills** | Four stacks: Frontend · Backend · AI · Tools |
| 09 | **Contact** | Form (FormSubmit) + studio details + socials |
| — | **Footer** | Big CTA, sitemap, legal links, live time |

---

## 🛠️ Tech Stack

**Frontend**
- HTML5 (semantic, accessible)
- CSS3 (custom properties, grid, container queries, no preprocessor)
- Vanilla JavaScript (ES6+)

**Animation & Motion**
- [GSAP 3.12](https://gsap.com/) + ScrollTrigger
- Custom magnetic-cursor and reveal-on-scroll utilities

**Typography**
- Fraunces (display)
- EB Garamond (italic accents)
- Inter (UI / body)
- JetBrains Mono (terminal mock)

**Forms**
- [FormSubmit](https://formsubmit.co/) (no backend required)

**SEO / Meta**
- Open Graph + Twitter cards
- JSON-LD `Person` structured data
- Canonical URL, theme-color, inline SVG favicon

---

## 📁 Project Structure

```
portfolio_site/
├── index.html          # Main single-page site
├── privacy.html        # Privacy policy
├── terms.html          # Terms & conditions
├── css/
│   └── styles.css      # All styles (custom properties + utilities)
├── js/
│   └── main.js         # Loader, cursor, rotator, reveal, motion
└── assets/
    ├── og-cover.svg            # Open Graph image
    ├── phase-01...06.svg       # Process timeline illustrations
    └── preview-*.svg           # Project card previews
```

---

## 🚀 Featured Work

| Project | Type | Stack | Live |
|---|---|---|---|
| **Oriva** — The Art of Dentistry | Luxury landing | HTML · CSS · JS · GSAP | [Open](https://oriva-dental-production.up.railway.app/) |
| **Doméa** — Interiors Studio | Luxury landing | HTML · CSS · JS · Motion | [Open](https://domea-interiors-production.up.railway.app/) |
| **PhysioCare** — Clinic Platform | Full-stack product | Python · Flask · SQLAlchemy · Claude AI | [Open](https://physio-care-production.up.railway.app/) |
| **Al-Safar Travels** | Travel landing | HTML · CSS · JS · GSAP | [Open](https://al-safar-travels-production.up.railway.app/) |

---

## 💻 Running Locally

No build step — just serve the folder.

```bash
# Option 1 — Python
python -m http.server 8000

# Option 2 — Node (http-server)
npx http-server . -p 8000

# Option 3 — VS Code "Live Server" extension
```

Then visit [http://localhost:8000](http://localhost:8000).

---

## 🌍 Deployment

The site is fully static and deploys to any host:

- **Vercel** / **Netlify** — drop the folder, done
- **Railway** — `serve` static buildpack
- **GitHub Pages** — push to `main`, enable Pages from repo settings
- **Custom domain** — point an `A`/`CNAME` record at the host

---

## 🎨 Design Tokens

Defined as CSS custom properties at the top of `css/styles.css`:

- `--ink` — near-black background
- `--gold` — `#C9A961` (brand accent)
- `--parchment` — warm off-white
- `--rule` — hairline divider
- Typography scale, spacing scale, easing curves

Override in a single place to re-skin the entire site.

---

## ♿ Accessibility & Performance

- Semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`)
- `aria-*` attributes on interactive widgets (rotator, filters, mobile menu)
- Reduced-motion respected via `prefers-reduced-motion`
- All images lazy-loaded with `loading="lazy"`
- Fonts preconnected; CSS/JS loaded with `defer`
- Lighthouse target: 95+ on every category

---

## 📬 Contact

- **Email** — [akeef.farooqi@gmail.com](mailto:akeef.farooqi@gmail.com)
- **LinkedIn** — [akeeffarooqi7](https://www.linkedin.com/in/akeeffarooqi7/)
- **GitHub** — [Akeeffarooqi7](https://github.com/Akeeffarooqi7/)
- **Instagram** — [@akeef_farooqi7](https://www.instagram.com/akeef_farooqi7/)

Studio · India · Working worldwide · Mon–Sat · 10:00–19:00 IST.

---

## 📄 License

© 2025 Akeef Farooqi. All rights reserved.
The code is published for reference and inspiration — please don't copy the design wholesale for client work. If you'd like a site like this, [get in touch](mailto:akeef.farooqi@gmail.com).
