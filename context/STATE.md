# STATE: where BBD is right now

_Last updated: 10 Oct 2026, 10:30 am IST. Overwrite at the end of every session; keep it
under 50 lines. The longer 9 Oct version: `git show 4baae20:context/STATE.md`._

## Live
- https://kalpit.me/BBD/: picks in Phones, TVs, Laptops, Home, Audio & chargers,
  Fitness, Gadgets. Ask box at `askUrl`. Sales: Amazon from 8 Oct, Flipkart from 9 Oct.
- Price check: Routine "BBD price check (every 3h)" runs `/price-check` in the cloud
  session "BBD price checker", pushes confirmed price changes and notifies Kalpit's
  phone. It also runs the deal scout (public Telegram channels). Delete it after the sale.
- DNS on Cloudflare (DNS-only records; registrar and email forwarding still Porkbun).

## New since 10 Oct (two governance reviews; details in docs/IDEAS.md → Governance)
- Goals now head AGENTS.md. Adding picks: veto, not approve, rules in `docs/PICKS.md`,
  limits enforced by the validator (max 4 waiting, 2 per run, can't take the top spot).
- Safety nets: validator blocks affiliate prices, foreign tracking links, near-duplicate
  names, re-adding `removed` picks, phone numbers or tokens in notes. Smoke test also
  runs in GitHub after each push. Price check stamps `checked` at most every 6 h.

## Open asks (waiting on Kalpit)
1. Cloudflare: set bbd-ask build watch paths to `worker/*` and `wrangler.toml` (IDEAS G3).
   Optional: change the price-check Routine to every 3 h from 8 am to 11 pm IST only (G11).
2. Turn on Cloudflare Web Analytics for kalpit.me and share the snippet (IDEAS C1).
3. Decide: Diwali gift tab (A3), WhatsApp self-send link without the affiliate tag (A5),
   one dated source enough to move an affiliate band (G6).
4. Turn off workers.dev for bbd-ask; delete the leftover `ccr-*` branches on GitHub.
5. Confirm `add-bbd-redirect` is merged in the Kalpit.me repo (lowercase /bbd works now).
6. Real prices for Vivo X200T, Motorola Edge 70 (still `est`), plus Lenovo IdeaPad
   Slim 3 and the 55-inch TVs. Image versions of the two Flipkart TV/Home cheat sheets help.
7. Optional: EarnKaro links for Flipkart items; Amazon product API (explore in a new chat).

## Known gaps
- No 32/43-inch TVs, air purifiers, geysers or gaming laptops yet (IDEAS A1, A2, A7).
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 57 of 138 picks; missing for most Flipkart phones and washing machines.
- Ask box can lead with the shortlist's top pick when a question names a brand (IDEAS A6).
- Not added (no BBD price found): Poco M8, Oppo K13 / K13 Turbo Pro, Realme P4 Pro.
- pricebefore.com helper: curl a product page; daily prices sit in `dates`/`prices` arrays.
- GitHub often shows Worker builds as "failure" even when they deploy; noise unless the
  Ask box misbehaves.

## Next steps for an agent
1. Add 32/43-inch TVs under the veto rule (lower the TV slider `min` if needed). Seasonal
   picks (A2) need new Home types, so ask Kalpit first.
2. Check the real sale end dates before proposing the 20 Oct sunset (IDEAS A4).
3. Build C2 ("Share this list with family" button) once Kalpit OKs it.
