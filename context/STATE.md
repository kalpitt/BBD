# STATE: where BBD is right now

_Last updated: 10 Oct 2026, 11:10 am IST. Overwrite at the end of every session; keep it
under 50 lines. The longer 9 Oct version: `git show 4baae20:context/STATE.md`._

## Live
- https://kalpit.me/BBD/: 155 picks, 7 tabs (Home now has Air purifier, Geyser). Ask box
  at `askUrl`. Sales: Amazon from 8 Oct, Flipkart from 9 Oct. Phones (cc130d8, another
  chat): "Best camera"/"Lasts longest" cards, "Lasts long" filter, `spec` on phones ≥ ₹20k.
- Affiliate cut-off (10 Oct): Amazon `aff: true` only at ~₹250+ commission per sale
  (docs/DATA.md, official rate table); 59 affiliate (band), 96 exact-price picks.
- Price check: Routine "BBD price check (9:05 am to 12:05 am, every 3h)", IST, runs
  `/price-check` in the cloud session "BBD price checker" (prices + deal scout).
- Cloudflare: Web Analytics live (filter path `/BBD`). Worker rebuilds only when
  `worker/*` or `wrangler.toml` change.

## Governance (10 Oct; details in docs/IDEAS.md → Governance)
- Goals head AGENTS.md: (a) friends and family buy well, (c) reach; affiliate is a side effect.
- Adding picks: veto, not approve. Rules in `docs/PICKS.md`; the validator enforces the
  limits (max 4 auto picks waiting, 2 per run, never the top pick over Kalpit's own).
- "Send to myself on WhatsApp" links only to kalpit.me/BBD views, no store links.

## Open asks (waiting on Kalpit)
1. Decide: Diwali gifts tab (A3), "Share with family" button (C2), one dated source
   enough to move an affiliate band (G6). (A2 purifiers/geysers: done 10 Oct.)
2. Confirm `add-bbd-redirect` is merged in the Kalpit.me repo (lowercase /bbd works now).
3. Real prices for Vivo X200T, Motorola Edge 70, IdeaPad Slim 3, the 55-inch TVs (`est`).
4. Optional: EarnKaro links for Flipkart items; Amazon product API (explore in a new chat).

## Known gaps
- No laptop under ₹33k with 512GB and a confirmed price; no gaming laptop (only RTX 3050
  models had confirmed prices, poor value). Laptop slider max now 1,30,000.
- New picks are Flipkart listing prices only (Amazon pages block scripts); no `was` yet.
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 57 of 155 picks; missing for most Flipkart picks.
- Ask box can lead with the shortlist's top pick when a question names a brand (IDEAS A6).
- Not added (no BBD price found): Poco M8, Oppo K13 / K13 Turbo Pro, Realme P4 Pro.
- Echo/Fire TV commission rate isn't in Amazon's table (assumed under ₹250, exact price).
- Price helpers: pricebefore.com pages have `dates`/`prices` arrays; Flipkart pages
  (mobile UA curl) have `finalPrice` and per-card "₹ X off" offers.

## Next steps for an agent
1. Add `was` (pricebefore, 1–20 Sep) for the 15 picks added 10 Oct (Kalpit: keep).
2. Check the real sale end dates (Amazon may run to 8 Nov); tell Kalpit before 20 Oct.
3. Ask Kalpit about the open decisions in "Open asks" 1.
