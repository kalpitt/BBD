---
name: promo-video
description: Make or change a promo video for kalpit.me/BBD (or any video Kalpit asks for) in code. Applies John Lasseter's animation principles to every motion. Use when Kalpit says "make a video", "promo", "reel", "status video", or asks to change the existing one.
---

# Promo videos (code-made, Lasseter principles)

Kalpit's standing rule (10 Oct): **every video follows John Lasseter's principles of
animation** ("Principles of Traditional Animation Applied to 3D Computer Animation",
SIGGRAPH 1987). Check each scene against the table below before rendering.

## The 11 principles and how we apply them

| # | Principle | What it means | How we do it in code (`src/scene.html`) |
|---|---|---|---|
| 1 | Squash & stretch | Things deform when they move and land, keeping their volume | `squash(s)`: stretch while flying in, squash on impact, wobble settles (sx × sy = 1) |
| 2 | Timing | Speed shows weight and gives the viewer time to read | Light things (chips) 0.2 s, heavy things (phone) ~0.8 s. Hold text at least 0.3 s per word on screen; hold a price ≥ 0.8 s |
| 3 | Anticipation | A small move the opposite way before the main move | `antic(x)`: slider thumb presses down first, URL pill pulls back before it slams, scenes "inhale" before they exit |
| 4 | Staging | One idea at a time, eye goes to one place | One headline per scene; new card in front, old ones dimmed and blurred behind; nothing else moves while the key thing lands |
| 5 | Follow-through & overlapping action | Parts don't all stop together | `spring()`: card stops, then its name, line and price settle 60 ms apart; chips land one after another |
| 6 | Straight-ahead vs pose-to-pose | Plan key poses, then fill in between | Each scene is a list of key times (`S`, `STOPS`); `render(t)` interpolates between them. Storyboard first |
| 7 | Slow in & slow out | Ease, never linear (except steady background drift and typing) | `eo`, `eio`, `spring` everywhere |
| 8 | Arcs | Natural motion follows curves | `arc()`: cards and phone travel on curves, never straight lines |
| 9 | Exaggeration | Push the key moments | Big squash on "Kaunsa lein?", the 135+ and the URL slam; small camera shake on those hits only |
| 10 | Secondary action | Small supporting motion that adds life | Glows pulse with the kick drum, sparks drift, spark burst on the URL, typing dots bounce |
| 11 | Appeal | Clear, pleasing, on-brand | Site colours and fonts, no ugly blur mush in transitions, readable at phone size |

## Honesty rules for videos (same as the site)

- Only show **real picks**: read them off the live page, don't guess. `src/picks.js` prints
  the site's actual top pick per budget and filter (serve the repo on :8765 first).
- Phones and non-affiliate items: exact price. `aff: true` items: the **price band** the site shows
  (`band()` in `index.html`), never an exact ₹.
- **No price count-ups or made-up numbers.** A paused frame must never show a price that isn't real.
  No invented "-45%" discounts.
- AI chat: use a **real answer** from the live ask box (one question, `Origin: https://kalpit.me`).
  You may trim at a sentence end; don't reword.
- Brand variety: don't let one brand dominate. Pick examples across brands and uses.
- No friends' names, no private details. Kalpit's face only if he says so.
- Re-check prices on the day you render; they change during the sale.

## How to render

Tools in the cloud container: Node + Playwright (Chromium at `/opt/pw-browsers`), ffmpeg, Python + numpy.

1. Copy `src/` to the scratchpad (frames are big; never write them into the repo).
2. Edit `scene.html` (`render(t)` must be a pure function of time) and `beat.py` (cue times match the animation).
3. Preview stills: `node render.js preview 1.5 8 14` → check a contact sheet.
4. Render in parallel (4 cores): `node render.js frames <start> <end>` × 4, then
   `ffmpeg -framerate 30 -i frames/f%04d.png -i beat.wav -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4`
5. Format: 1080×1920, 30 fps, under 60 s for WhatsApp Status (aim 20–25 s).
6. Send the MP4 to Kalpit. Don't commit video files.
