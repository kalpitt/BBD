# STATE: where BBD is right now

_Last updated: 10 Oct 2026, 10:08 am IST. Overwrite at the end of every session; keep it
under 50 lines. The longer 9 Oct version: `git show 4baae20:context/STATE.md`._

## Live
- https://kalpit.me/BBD/: 138 picks in Phones, TVs, Laptops, Home, Audio & chargers,
  Fitness, Gadgets. Ask box at `askUrl` (workers.dev address off since 10 Oct).
  Sales: Amazon from 8 Oct, Flipkart from 9 Oct.
- Price check: Routine "BBD price check (9:05 am to 12:05 am, every 3h)", IST; the
  12:05 am run catches midnight price changes. Runs `/price-check` in the cloud session
  "BBD price checker", pushes confirmed changes, runs the deal scout, notifies Kalpit.
- Cloudflare: kalpit.me is proxied; Web Analytics live for all of kalpit.me (automatic
  setup; filter path `/BBD`). Worker rebuilds only when `worker/*` or `wrangler.toml` change.
- GitHub: only `main` exists. CI runs the validator and the smoke test after each push.

## Governance (10 Oct; details in docs/IDEAS.md → Governance)
- Goals head AGENTS.md: (a) friends and family buy well, (c) reach; affiliate is a side effect.
- Adding picks: veto, not approve. Rules in `docs/PICKS.md`; the validator enforces the
  limits (max 4 auto picks waiting, 2 per run, never the top pick over Kalpit's own).
- "Send to myself on WhatsApp" links only to kalpit.me/BBD views, no store links.
- Guide Kalpit through dashboards with direct links, then numbered taps.

## Open asks (waiting on Kalpit)
1. Decide: Diwali gifts tab (A3), "Share with family" button (C2), seasonal Home types
   (A2: air purifiers, geysers), one dated source enough to move an affiliate band (G6).
2. Confirm `add-bbd-redirect` is merged in the Kalpit.me repo (lowercase /bbd works now).
3. Real prices for Vivo X200T, Motorola Edge 70, Lenovo IdeaPad Slim 3 and the 55-inch
   TVs (still `est`). Image versions of the two Flipkart TV/Home cheat sheets help.
4. Optional: EarnKaro links for Flipkart items; Amazon product API (explore in a new chat).

## Known gaps
- No 32/43-inch TVs, air purifiers, geysers or gaming laptops yet (IDEAS A1, A2, A7).
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 57 of 138 picks; missing for most Flipkart phones and washing machines.
- Ask box can lead with the shortlist's top pick when a question names a brand (IDEAS A6).
- Not added (no BBD price found): Poco M8, Oppo K13 / K13 Turbo Pro, Realme P4 Pro.
- pricebefore.com helper: curl a product page; daily prices sit in `dates`/`prices` arrays.

## Next steps for an agent
1. Add 32/43-inch TVs under docs/PICKS.md (Kalpit had no preference; this was next).
   Lower the TV slider `min` (now 35,000) to fit them. Up to 2 per chat, `auto: true`.
2. Check the real 2026 sale end dates (Amazon may run to Diwali, 8 Nov) and tell Kalpit
   before the 20 Oct sunset (AGENTS rule 6, IDEAS A4).
3. Ask Kalpit about the open decisions in "Open asks" 1.
