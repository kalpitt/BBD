# STATE: where BBD is right now

_Last updated: 10 Oct 2026, 4:53 pm IST. Overwrite at the end of every session; keep it
under 50 lines. The longer 9 Oct version: `git show 4baae20:context/STATE.md`._

## Live
- https://kalpit.me/BBD/: 168 picks, 8 tabs incl. "Diwali gifts". 64 affiliate (band),
  the rest exact prices. "Share this list with family" button.
- Ask box is a chat: floating 💬 button, full screen on phones, side panel on laptops,
  👍/👎 under answers. "Message Kalpit" (header, teaser, after 👎 / 2nd question / errors)
  opens a form the Worker emails to him from bbd@kalpit.me (`MSG_TO` secret). His WhatsApp
  is off the page; family use his private `?f=` link (never in the repo).
- Phones: S25 FE top ₹45–55k, S25 Ultra top ₹85k–1.3L, Pixel 11 only ₹70–85k. Nothing
  Phone (4a) Pro (₹49,999) is the "Best camera" card at ₹50–55k via `altScore`.
- Price check: Routine "BBD price check, Sonnet (9:05 am to 12:05 am, every 3h)" wakes the
  Sonnet session "BBD price checker, Sonnet". Old Opus Routine and a fresh-session test
  Routine are paused (fresh sessions can't push). Details: AGENTS.md → Why things are.
- Sunset (Kalpit, 10 Oct): site + price check stay on through Diwali, 8 Nov. Ask on 9 Nov.
- Cloudflare: Web Analytics live (filter path `/BBD`); Email Routing on kalpit.me
  (Porkbun MX/SPF removed); Worker rebuilds only when `worker/*` or `wrangler.toml` change.

## Governance (details in AGENTS.md, docs/IDEAS.md → Governance)
- Goals: (a) friends and family buy well, (c) reach; affiliate is a side effect.
- Adding picks: veto, not approve (`docs/PICKS.md`; validator enforces the limits).
- Score changes move dial handovers: simulate every budget first, tell Kalpit what moves.
- Amazon prices need his screenshot or two dated reports (agents can't read Amazon pages).

## Open asks (waiting on Kalpit)
1. Nothing (4a) Pro: launch ₹39,999, Jun low ₹44,999 (pricebefore); ₹49,999 now. Keep?
2. `add-bbd-redirect` in Kalpit.me: he'll merge it first thing in that repo.
3. Optional: EarnKaro links for Flipkart items; Amazon product API (explore in a new chat).

## Known gaps
- OnePlus 13s is no longer top or "Best camera" anywhere (Kalpit: weak camera). Fine.
- Laptops: under ₹40k only the Acer Aspire One 14; no gaming laptop.
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 60 of 168 picks; gift prices are plain listing prices (bank offers unchecked).
- "Send to Kalpit" rate limit (3/day/visitor) is per Worker instance, best effort.
- Price helpers: pricebefore.com pages have `dates`/`prices` arrays; Flipkart pages
  (mobile UA curl) have `finalPrice`, `nepPrice` and per-card "₹ X off" offers.

## Next steps for an agent
1. Check the Sonnet price checker's first runs (3:05 pm onward) pushed or reported cleanly.
2. Price-check Routine prompt: can only be edited from its own session (skill now says "write to you").
3. Ideas still open in docs/IDEAS.md: G15 weekly question, C1 per-pick click counts.
