# 🌙 Pip's Midnight Nursery

**Track 1 entry** for [haX.baby's "Baby's First Website"](https://hax.baby/first-website) — a 48-hour online hackathon (Oct 17–19, 2026).

🔗 **Live site:** https://pips-midnight-nursery.vercel.app/

## Meet Pip
Pip is a baby with a cozy skull face who works as a **Junior Dream Engineer** at the Midnight Nursery — designing the dreams, lullabies, and nightlights that tuck the neighborhood's little creatures to sleep. *"I build the dreams you fall asleep inside."*

## The concept
Pip's portfolio as a 90s dream-desk: warm cream + berry retro styling, chunky borders, marquees, starfields — early-web soul, fully committed. Every project is a playable toy, not a card.

## ✨ Features
- **6 playable projects** — Lullaby Lab (real Web Audio synth, 3 rotating nightly melodies), Nightlight Collection (day/night mode), Dream Delivery Routes (animated SVG map), Growth Chart (tap-for-facts), Block Tower (stacking mini-game with keyboard + touch), Bedtime Storybook (5-page flipbook)
- **Dream Vault** — flashlight cursor revealing 8 collectible dreams, including a golden one
- **Ask Pip** — rule-based chat in Pip's voice (remembers your name, plays lullabies on request)
- **Live guestbook** — Firebase Realtime Database wall shared across all visitors
- **Visitor memory** — return visits greet you by name and visit count
- **4 hidden easter eggs** — nightcap ×5 clicks, moon ×3 taps, odometer ×3 clicks, golden dream
- **All 5 side quests** — live guestbook (+2), sparkle cursor trail (+2), odometer hit counter (+1), click sounds + mute toggle (+3), responsive chaos mode (+5)
- Day/night mode, mobile-first responsive, zero console errors

## 🛠 Built with
Vanilla HTML/CSS/JS — no frameworks, no build step. Firebase Realtime Database (free tier) for the guestbook only. All sound synthesized live with the Web Audio API (no audio files). Deployed on Vercel.

## 🏃 Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## 🎨 Credits
- Pip character art: official Track 1 asset pack by haX.baby (free for hackathon use)
- Everything else hand-built during the 48-hour sprint

*Built solo with an AI pair-programmer (explicitly allowed by the rules) — every line understood, tested, and shipped by hand.*
