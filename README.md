# 🌙 Pip's Midnight Nursery

[![Live Site](https://img.shields.io/badge/live-pips--midnight--nursery.vercel.app-ff69b4)](https://pips-midnight-nursery.vercel.app/)
[![Track](https://img.shields.io/badge/track-1%20%E2%80%A2%20Pip-blueviolet)](https://hax.baby/first-website)
[![Stack](https://img.shields.io/badge/stack-vanilla%20HTML%2FCSS%2FJS-yellow)](https://developer.mozilla.org/en-US/docs/Web)
[![Sprint](https://img.shields.io/badge/built--in-48h%20sprint-orange)](https://hax.baby/first-website)

**Track 1 entry** for [haX.baby's "Baby's First Website"](https://hax.baby/first-website) — a 48-hour online hackathon (Oct 17–19, 2026).

🔗 **Live:** https://pips-midnight-nursery.vercel.app/ · 📦 **Repo:** https://github.com/manthansingh26/pips-midnight-nursery

## 📖 Contents
- [The concept](#-the-concept)
- [Features](#-features)
- [Side quests](#-side-quests-1313)
- [Easter eggs](#-easter-eggs) *(spoilers!)*
- [Tech](#-tech)
- [Project structure](#-project-structure)
- [Run locally](#-run-locally)
- [Sprint log](#-sprint-log)
- [Credits](#-credits)

## 🎯 The concept
Everyone gets the same baby — *"Same Baby, 1,000 Websites."* So the contest is execution. My angle: **what if Pip's portfolio was a 90s GeoCities-style dream-desk?** Warm cream (`#fff8f1`) + berry (`#a34063`), chunky outset borders, marquee tickers, starfields, "under construction" badges — early-web soul, fully committed, never a modern dark SaaS in disguise.

One design rule governed everything: **every project must be a toy, not a card.** If you can't poke it, it doesn't ship.

## ✨ Features

### 🧸 Six playable projects (the brief asked for 3 — all six canon ideas are here)
| # | Project | What it does |
|---|---------|--------------|
| 1 | **Lullaby Lab** | Real Web Audio music-box synth. A different melody every night (Twinkle Twinkle / Honey Waltz / Little Lamb's Dream) |
| 2 | **Nightlight Collection** | Day/night mode that relights the entire page around the lantern |
| 3 | **Dream Delivery Routes** | Animated SVG rooftop flight path with a dream dot on endless loop |
| 4 | **Growth Chart** | Nursery-wall skill chart — bars grow on scroll, tap for the story behind each skill |
| 5 | **Block Tower** | Full stacking mini-game: tap/Space to drop, overhangs slice off, perfect drops chime, best score saved |
| 6 | **Bedtime Storybook** | 5-page flipbook ("Pip and the Sleepless Star") — buttons, swipe, arrow keys |

### 🔦 Interactive moments
- **Dream Vault** — flashlight cursor revealing 8 collectible dreams in the dark (Tier 2 pick)
- **Ask Pip** — rule-based chat in Pip's giggly voice; remembers your name, plays lullabies on request (Tier 3 pick)
- **Hero Pip** — tilts toward your cursor (gentle bob on touch), giggles when tapped
- **Live guestbook** — Firebase Realtime Database wall shared across all visitors (Tier 3 pick)
- **Visitor memory** — return visits greet you by name and visit count (Tier 3 pick)

### 🥚 Easter eggs
<details>
<summary><b>Spoilers — click to reveal (4 total)</b></summary>

1. Click Pip's nightcap **5 times** → secret lullaby + confetti
2. Tap the 🌙 in the dream map **3 times** → meteor shower
3. Click the visitor odometer **3 times** → "Pip counted you twice, just to be sure"
4. Find the **golden dream** in the vault → confetti + fanfare

</details>

### 🎰 Side quests — 13/13
- [x] **Live guestbook** (+2) — real Firebase backend, not localStorage
- [x] **Sparkle cursor trail** (+2) — skips touch devices & reduced-motion
- [x] **Hit counter odometer** (+1) — vintage LED ticker in the footer
- [x] **Click sounds + mute** (+3) — Web Audio blips, fixed mute button, persisted
- [x] **Responsive Chaos Mode** (+5) — flips the page full 90s, still usable on mobile

## 🛠 Tech
**Vanilla HTML/CSS/JS. No frameworks, no build step, no npm.** Deliberate choice: fastest load, smallest failure surface, every line hand-understood (required — I must be able to defend all of it).

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Hand-written HTML/CSS/JS | Zero-dependency, instant load |
| Database | Firebase Realtime Database (free tier) | Guestbook only; realtime without a backend |
| Audio | Web Audio API | All sound synthesized in code — zero audio files |
| Hosting | Vercel (auto-deploy on push) | Static, fast, free |
| Images | Official Pip asset pack, converted to WebP | 3 MB → ~50 KB for mobile |

**Firebase security rules** — public read; create-only writes (`!data.exists()`); name ≤ 24 chars, wish ≤ 140 chars, validated server-side. Keys are public by design; the rules are the lock. All user content rendered via `textContent` (XSS-safe).

## 📁 Project structure
```
├── index.html          # all sections, semantic markup
├── styles.css          # retro skin + night mode + chaos mode + reduced-motion
├── main.js             # every interaction (see below)
├── firebase-config.js  # public Firebase config (safe to commit)
└── assets/             # official Pip art, optimized for web
    ├── pip_avatar_cloud.webp
    ├── pip_lullaby_box.webp
    ├── pip_dream_lantern.webp
    └── pip_portrait.webp
```
`main.js` modules: sound engine · mute · lullaby synth · hero tracking + egg · confetti · sparkles · odometer · guestbook (Firebase/local) · growth chart · tower game · storybook · vault flashlight · surprise layer · Ask Pip · day/night · chaos · scroll reveals.

## 🏃 Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
No build, no install. (Guestbook falls back to localStorage without Firebase config.)

## 📜 Sprint log
- **Day 1 (Oct 17):** baseline retro site → Firebase guestbook → growth chart → block tower → surprise layer → storybook → dream vault → Ask Pip → full QA (10/10 pass)
- **Day 2 (Oct 18):** polish, README, submission
- **Day 3 (Oct 19):** final QA → submit before 17:17 IST freeze

## 🎨 Credits
- **Pip character art:** official Track 1 asset pack by [haX.baby](https://hax.baby) — free for hackathon use, credited in the site footer as required
- **Everything else:** hand-built during the 48-hour sprint

*Built solo with an AI pair-programmer (explicitly allowed by the rules). Every line understood, tested on phone + desktop, and shipped by hand. Zero console errors — or it doesn't ship.* 🌙
