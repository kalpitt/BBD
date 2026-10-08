# STATE: where BBD is right now

_Last updated: 8 Oct 2026, 4:45 pm IST. Overwrite this file at the end of every session._

## Live
- https://kalpit.me/BBD/ is live with 135 picks across Phones, TVs, Laptops, Home,
  Audio & chargers (Earbuds / Headphones & speakers / Chargers tabs), Fitness and Gadgets
  (Watches / Camera & creator / Desk / Tablet & smart home). 8 Oct: Kalpit added 32 Amazon affiliate
  picks (helped by @r3dash's deal threads, credited in README); price bands tightened to ~5-8% of price; TVs now include an OLED and a 75-inch (slider to ₹1.4L). Phones cover ₹7k–₹1.6L, with use-case chips (parents, basic, battery,
  camera, gaming, iPhone).
- Ask box is live at https://ask.kalpit.me (`askUrl`). Until ~9 Oct 2:30 pm IST the page
  falls back to the old workers.dev address (`askFallback`) while DNS caches update.
  Then: delete `askFallback`, and Kalpit turns off workers.dev in Cloudflare. A reminder
  is scheduled into this project's chat for 9 Oct, 2:30 pm IST. The Ask box leads with the
  shortlist's top pick, respects budget, and refuses off-list questions.
- Share links keep the view: `kalpit.me/BBD#phones-15000-parents`, `#home-ac-36000`.
  WhatsApp shows a preview image (`og.png`).
- Ask-box answers refresh within ~5 min of any data.json edit that bumps `updated`
  (it's part of the cache key). No need to bump `v2` for price changes.
- Sales: Amazon from 8 Oct, Flipkart from 9 Oct (8 Oct for Plus/Black members).
- Kalpit's picks were cross-checked on 7 Oct against two trusted YouTube videos. See AGENTS.md →
  "The picks are Kalpit's own" for his standing calls; sources are credited in README.

- **Price-check agent:** a Routine "BBD price check (every 3h)" wakes the cloud session
  "BBD price checker (woken every 3h)" (environment BBD) to run `/price-check`. It pushes
  confirmed price changes to main and notifies Kalpit's phone. Flipkart pages are
  readable; Amazon blocks bots, so Amazon prices need two dated sale reports. Delete
  the Routine after the sale (~20 Oct). Its prompt starts with `git pull --rebase`, which is
  safe after the 8 Oct history squash (tested). Never use plain `git pull` in an old clone.
- **DNS:** kalpit.me is on Cloudflare DNS since 8 Oct (moved from Porkbun; registrar is
  still Porkbun). All records DNS-only (grey cloud) so GitHub Pages HTTPS keeps working.
  Email forwarding still runs through Porkbun (MX fwd1/fwd2.porkbun.com).
- **Repo is clean to share:** one squashed commit (8 Oct) plus new ones, noreply author
  email, sources credited in README → Credits.

## Discount layers (live on main since 8 Oct)
- Fields `was`, `list`, `coupon`, `bank` {name, off}; `p` stays final. Validator enforces
  `p = list − coupon − bank.off`. Docs: `docs/DATA.md` → Discount layers.
- Big deal = card offer > 12% of pre-card price, or `p` ≤ 75% of `was`. Shows 🔥 badge,
  "Big deals" chip (only in tabs that have one), +1 ranking boost (page + Worker), and
  "BIG DEAL" in the Ask box product lines. Affiliate breakdowns are labels only.
- Backfilled list + bank for 13 items (prices from @r3dash's threads), and `was` for 9 items from
  pricebefore.com (lowest 1–20 Sep, Amazon listing confirmed by matching sale-day price).
  Big deals: Ray-Ban Meta, WalkPad-2 (card offer); Sony XM5, Bose QC, MX Master 3S (vs Sep).
- No `was` found / skipped: Ray-Ban (no drop vs Sep), T7 Shield (sat at MRP), Dell 15,
  Garmin 265, Edifier, Momentum 4, Bose QC buds, OnePlus Pad 2, Ring AIR, G-Shock, Mic Mini,
  SanDisk, Fire TV Stick, MacBook Neo, LG C6 (no matching listing).
- Phones: `was` for 8 (Fold7, S25 Ultra, 13s, Nord CE6, M17e, G06 Power, Vibe2, Virat V1).
  HMD Vibe2 is a 🔥 big deal (₹14,999 all Aug–Sep, now ₹10,499). Skipped M47 (no drop),
  Narzo 100 Lite (cheaper in Sep). Most Flipkart phones had no Flipkart listing on the
  tracker; retry after 9 Oct or with direct Flipkart URLs.
- Still to do: `was` and layers for phones/Flipkart items, and the one-time review of every affiliate band vs plain link (Kalpit's call).

## Open asks (waiting on Kalpit)
1. Merge `add-bbd-redirect` in the Kalpit.me repo so lowercase `/bbd` survives
   main-site deploys: https://github.com/kalpitt/Kalpit.me/pull/new/add-bbd-redirect
2. Real BBD prices for **Vivo X200T** and **Motorola Edge 70** (listed as expected ranges).
3. Two Flipkart cheat-sheet PDFs (TVs/large appliances and Home) are image-only. Share
   them as images to firm up TV prices (TVs are `est: true`).
4. Optional: EarnKaro links for Flipkart items.
5. **Cloudflare Worker builds fail** since 8 Oct ~12:00 pm (before the cleanup). The live
   Worker already runs the current `worker/worker.js` (unchanged since the last good
   build) and a local `wrangler deploy --dry-run` passes, so the cause is on Cloudflare's
   side. Needs Kalpit's screenshot of the build log (bbd-ask → Builds). Must be fixed
   before any `worker/worker.js` change, or that change won't go live.
6. After 9 Oct: turn off workers.dev for bbd-ask, and optionally delete the two leftover
   `ccr-*` branches on GitHub (they point at the clean commit; deletion was blocked for agents).
7. Kalpit wants a repo-wide review of improvement opportunities (deferred, not started).

## Known gaps
- 8 Oct adds with only one source (no second report found): Sony WF-1000XM5, Bose QC
  Earbuds, Sennheiser IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner,
  Cadola Lydden Hill. Kalpit approved publishing them; spot-check if possible.
- TVs: only 55-inch picks, with expected ranges (top of range = Amazon early-deal price,
  27 Sep). No 32-inch or 43-inch TVs yet, because no confirmed 2026 sale prices.
- Laptops: everyday/office only (incl. MacBook Neo, est.). No gaming laptops yet, because no
  2026 sale prices were found.
- The AI occasionally gives one product another's price (e.g. A36 vs A56; seen again
  on 8 Oct). The cards under each answer show the correct price.
- When a question names a brand ("Nothing phone under 30k"), the AI can still lead with
  the shortlist's top pick (A36) instead of that brand's pick (Nothing 4b). Not a bug in
  budget handling; consider boosting brand matches in `bestMatches()` if Kalpit wants.
- Not added (no BBD price found): Poco M8, Oppo K13 / K13 Turbo Pro, Realme P4 Pro.

## Roadmap
- **Message Kalpit from the site:** done 8 Oct. "Message Kalpit on WhatsApp" link under
  the Ask box opens wa.me to his number with the page view, top pick, link and any typed
  question filled in. Nothing is sent or stored by us.

## Next steps for an agent
- 9 Oct afternoon: remove `askFallback` (data.json, docs/DATA.md, this file) once public
  DNS shows Cloudflare nameservers; verify the Ask box on the live page; then tell Kalpit
  to disable workers.dev.
- Fix the Worker build once Kalpit shares the log.
- Apply price and pick changes as Kalpit sends them (`/update-picks`).
- On 8–9 Oct, spot-check live sale prices against data.json, especially the estimates.
- Around 20 Oct, propose the sunset (banner, ask box off).
