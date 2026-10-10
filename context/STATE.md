_Last updated: 10 Oct 2026, 11:35 am IST. Overwrite at the end of every session; keep it
under 50 lines. The longer 9 Oct version: `git show 4baae20:context/STATE.md`._# STATE: where BBD is right now

_Last updated: 10 Oct 2026, 11:16 am IST. Overwrite at the end of every session; keep it
under 50 lines. The longer 9 Oct version: `git show 4baae20:context/STATE.md`._

## Live
- https://kalpit.me/BBD/: 163 picks, 8 tabs. New 10 Oct: "Diwali gifts" tab (₹500–5k; 8
  gifts + 6 picks from other tabs via `gift: true`), "Share this list with family" button. Ask box
  at `askUrl`. Sales: Amazon from 8 Oct, Flipkart from 9 Oct. Phones: "Best camera" and
  "Lasts longest" cards under the main pick (no filter), "Lasts long" filter (16 phones;
  rule in docs/DATA.md → `tags`), checked `spec` (chip, IP, frame) on the 37 phones ≥ ₹20k.
- Affiliate cut-off (10 Oct): Amazon `aff: true` only at ~₹250+ commission per sale
  (docs/DATA.md, official rate table); 59 affiliate (band), 104 exact-price picks.
- Sunset (Kalpit, 10 Oct): site + price check stay on through Diwali, 8 Nov. Ask on 9 Nov.
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
1. Veto check on the gifts tab (8 new gifts, 6 gift-tagged picks): "keep" or "remove X".
2. Real prices for Vivo X200T, Motorola Edge 70, IdeaPad Slim 3, the 55-inch TVs (`est`):
   he'll check the links himself and send prices.
3. `add-bbd-redirect` in Kalpit.me: he'll merge it first thing in that repo.
4. Optional: EarnKaro links for Flipkart items; Amazon product API (explore in a new chat).

## Known gaps
- No laptop under ₹33k with 512GB and a confirmed price; no gaming laptop (only RTX 3050
  models had confirmed prices, poor value). Laptop slider max now 1,30,000.
- New picks are Flipkart listing prices only (Amazon pages block scripts); no `was` yet.
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 60 of 163 picks. pricebefore has no Sep history for 11 of the 15 picks added
  10 Oct (or the 8 gifts). HP OmniBook skipped: flat ₹1,22,990 looks like list price.
- Ask box can lead with the shortlist's top pick when a question names a brand (IDEAS A6).
- Not added (no BBD price found): Poco M8, Oppo K13 / K13 Turbo Pro, Realme P4 Pro.
- Echo/Fire TV commission rate isn't in Amazon's table (assumed under ₹250, exact price).
- Price helpers: pricebefore.com pages have `dates`/`prices` arrays; Flipkart pages
  (mobile UA curl) have `finalPrice` and per-card "₹ X off" offers.

## Next steps for an agent
1. Kalpit's replies on the open asks above.
2. Gifts: check bank offers on the 8 gift listings (prices are plain listing prices).
3. Ideas still open in docs/IDEAS.md: G15 weekly question, C1 per-pick click counts.
