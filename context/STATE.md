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
- Price check (10 Oct, 2:10 pm): Routine "BBD price check, Sonnet (9:05 am to 12:05 am, every 3h)"
  wakes the Sonnet session "BBD price checker, Sonnet". The old Opus Routine is paused, not
  deleted (its session carried ~600k tokens). Fresh-session Routines can't push to the repo.
- Cloudflare: Web Analytics live (filter path `/BBD`). Worker rebuilds only when
  `worker/*` or `wrangler.toml` change.

## Governance (details in docs/IDEAS.md → Governance)
- Goals head AGENTS.md: (a) friends and family buy well, (c) reach; affiliate is a side effect.
- Adding picks: veto, not approve (`docs/PICKS.md`; validator enforces the limits).
- WhatsApp buttons link only to kalpit.me/BBD, never to a store.
- Kalpit prefers Amazon outside phones (service; ties go to Amazon). Agents can't read
  Amazon pages: Amazon prices need his screenshot or two dated reports.

## Contact (10 Oct)
- Kalpit's WhatsApp is off the page. 👎 in the ask chat shows a "Send to Kalpit" form, emailed by
  the Worker from bbd@kalpit.me to the `MSG_TO` secret. Family use his private `?f=` link
  (he has it; never in the repo). Docs: AGENTS.md (public repo section), docs/OPS.md.

## Open asks (waiting on Kalpit)
1. Nothing new. (Laptop under ₹40k: Kalpit sent Acer Aspire One 14 and Dell 15 Core 3.)
2. `add-bbd-redirect` in Kalpit.me: he'll merge it first thing in that repo.
3. Optional: EarnKaro links for Flipkart items; Amazon product API (explore in a new chat).

## Known gaps
- Laptops: under ₹40k only the Acer Aspire One 14 (256GB, HD screen); no gaming laptop (RTX 3050 models were poor value).
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 60 of 162 picks; pricebefore lacks Sep history for most 2026 models.
- Gift prices are plain Flipkart listing prices; bank offers not checked.
- Not added (no BBD price found): Poco M8, Oppo K13 / K13 Turbo Pro, Realme P4 Pro.
- Echo/Fire TV commission rate isn't in Amazon's table (assumed under ₹250, exact price).
- Price helpers: pricebefore.com pages have `dates`/`prices` arrays; Flipkart pages
  (mobile UA curl) have `finalPrice`, `nepPrice` and per-card "₹ X off" offers.

## Next steps for an agent
1. Watch the laptop tab: Acer Aspire One 14 is the only pick under ₹40k.
2. Gifts: check bank offers on the 8 gift listings.
3. Ideas still open in docs/IDEAS.md: G15 weekly question, C1 per-pick click counts.
