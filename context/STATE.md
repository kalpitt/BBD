# STATE: where BBD is right now

_Last updated: 10 Oct 2026, 12:00 pm IST. Overwrite at the end of every session; keep it
under 50 lines. The longer 9 Oct version: `git show 4baae20:context/STATE.md`._

## Live
- https://kalpit.me/BBD/: 162 picks, 8 tabs incl. "Diwali gifts" (₹500–5k; 8 gifts +
  6 picks from other tabs via `gift: true`). "Share this list with family" button. No
  `est` prices left (Kalpit's screenshots, 10 Oct). Ask box at `askUrl`.
- Phones: "Best camera" / "Lasts longest" cards, "Lasts long" filter, checked `spec` on
  phones ≥ ₹20k (unknown frames = plastic, Kalpit).
- Affiliate: Amazon `aff: true` only at ~₹250+ commission per sale (docs/DATA.md).
- Sunset (Kalpit, 10 Oct): site + price check stay on through Diwali, 8 Nov. Ask on 9 Nov.
- Price check: Routine "BBD price check (9:05 am to 12:05 am, every 3h)", IST, runs
  `/price-check` in the cloud session "BBD price checker". One dated report now moves
  an affiliate band (G6).
- Cloudflare: Web Analytics live (filter path `/BBD`). Worker rebuilds only when
  `worker/*` or `wrangler.toml` change.

## Governance (details in docs/IDEAS.md → Governance)
- Goals head AGENTS.md: (a) friends and family buy well, (c) reach; affiliate is a side effect.
- Adding picks: veto, not approve (`docs/PICKS.md`; validator enforces the limits).
- WhatsApp buttons link only to kalpit.me/BBD, never to a store.
- Kalpit prefers Amazon outside phones (service; ties go to Amazon). Agents can't read
  Amazon pages: Amazon prices need his screenshot or two dated reports.

## Open asks (waiting on Kalpit)
1. Laptop under ₹40k "that's a big deal": none found that honestly qualifies (LOG 10 Oct
   12:00 pm). Options: add Lenovo IdeaPad 3 14" i3-1215U 16/512 (Flipkart ₹40,799 −
   ₹2,000 ICICI/Axis = ₹38,799) as a normal pick, or he sends an Amazon screenshot.
2. `add-bbd-redirect` in Kalpit.me: he'll merge it first thing in that repo.
3. Optional: EarnKaro links for Flipkart items; Amazon product API (explore in a new chat).

## Known gaps
- Laptops: nothing under ₹40k; no gaming laptop (RTX 3050 models were poor value).
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 60 of 162 picks; pricebefore lacks Sep history for most 2026 models.
- Gift prices are plain Flipkart listing prices; bank offers not checked.
- Not added (no BBD price found): Poco M8, Oppo K13 / K13 Turbo Pro, Realme P4 Pro.
- Echo/Fire TV commission rate isn't in Amazon's table (assumed under ₹250, exact price).
- Price helpers: pricebefore.com pages have `dates`/`prices` arrays; Flipkart pages
  (mobile UA curl) have `finalPrice`, `nepPrice` and per-card "₹ X off" offers.

## Next steps for an agent
1. Kalpit's answer on the under-₹40k laptop (open ask 1).
2. Gifts: check bank offers on the 8 gift listings.
3. Ideas still open in docs/IDEAS.md: G15 weekly question, C1 per-pick click counts.
