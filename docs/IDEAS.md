# Ideas to make BBD better

From a strategy review on 10 Oct 2026. Kalpit's goals, in order:
**(a) help friends and family buy well**, (c) reach people beyond his circle.
Affiliate income is a side benefit, never the reason for a change.

Positioning: big sites (Smartprix, 91mobiles) list everything. BBD wins by being "a
friend who already did the homework". Keep the shortlist tight and trusted; don't
chase product count.

Status: ✅ done · 🔜 next · 💬 needs Kalpit · ⏸ later / only if data says so

## Governance (first, 10 Oct)
| # | Idea | Status |
|---|---|---|
| G1 | **Veto, not approve:** agents (chat and the price check) add picks that meet strict rules, then tell Kalpit; he replies "remove X" to undo. New picks carry `auto: true` until he's looked | ✅ AGENTS.md → Adding picks |
| G2 | **Short STATE:** STATE.md had grown to 142 lines of history. Cut to a snapshot (≤ 50 lines); history moved to LOG | ✅ |
| G3 | **Worker builds only when Worker code changes.** Today every push (even "Price check: no changes") rebuilds the ask-box Worker | 💬 Cloudflare dashboard → Workers & Pages → bbd-ask → Settings → Build → Build watch paths: include `worker/*` and `wrangler.toml` |
| G4 | **Test page and Worker code before it goes live.** `scripts/smoke.mjs` opens the page in a headless browser and checks picks render with no errors; the validator now also syntax-checks `index.html`'s scripts | ✅ |
| G5 | **One branch rule:** cloud sessions are handed `ccr-*` branches, which pile up. AGENTS.md now says push to `main` only | ✅ (leftover branches: 💬 delete in GitHub → Branches) |
| G7 | **Goals at the top of AGENTS.md**; affiliate never a reason | ✅ (round 2, 10 Oct) |
| G8 | **"Good pick" definition and who-decides-what table** in `docs/PICKS.md`; AGENTS.md just points to it | ✅ |
| G9 | **Validator enforces the auto-add limits**: max 4 waiting, 2 new per change, can't be top pick where one of Kalpit's would lead (sweeps every budget), no `est`, not in `removed`. Plus: affiliate price text is an error (₹, Rs, INR, 1,23,499), exact store hosts, no foreign `tag`/`affid`/`utm` params, `updated`/`checked` format, near-duplicate names, phone numbers or tokens in notes | ✅ |
| G10 | **Smoke test** covers lowest/highest budget and the shared-link scratch card, and runs in GitHub after each push | ✅ |
| G11 | Price check: top picks and `est` first; Kalpit's own prices are final; `checked` stamp at most every 6 h; no LOG lines. Optional: run the Routine only 8 am–11 pm | ✅ skill; schedule now 9:05 am to 12:05 am IST, every 3 h (catches midnight price changes) |
| G12 | Clearer replies: "add X", bare "keep", "remove X" (adds to `removed`), "undo" | ✅ |
| G13 | "Done" checks are GET-only; a real ask-box question only after Worker changes | ✅ |
| G14 | A Claude hook that runs the validator before every `git push` (project `.claude/settings.json`) | ✖ Kalpit: not needed |
| G15 | Weekly one-liner to Kalpit: "What did people ask you about on WhatsApp this week?" Feeds picks and FAQ with no tracking | 🔜 |
| G6 | Amazon evidence bar: affiliate prices need two dated reports, so the 78 banded items rarely get rechecked. Option: let one dated source move a band (bands are ~5–8% wide anyway) | 💬 |

## Helping friends and family (goal a)
| # | Idea | Why | Status |
|---|---|---|---|
| A1 | **32" and 43" TVs**, and lower the TV slider (now starts at ₹35k) | India's best-selling sizes; most TV buyers find nothing today. The deal scout already sees dated prices | 🔜 (G1 lets agents add them) |
| A2 | **Seasonal picks:** air purifiers (Oct–Nov pollution), geysers and room heaters (winter) | What families actually buy this month | 💬 new Home types need his OK; then agents fill them |
| A3 | **Diwali gifts under ₹1k / ₹2k / ₹5k** (new tab or chips) | Diwali is 8 Nov; gift lists are the most-shared thing | 🔜 💬 (new tab = his call) |
| A4 | **Check the sale end dates before the 20 Oct sunset** | Amazon's festival often runs until Diwali. Switching off early wastes the best weeks | 🔜 |
| A5 | **WhatsApp "Send to myself" text carries the Amazon affiliate link**; with no saved number it opens a contact picker, so it can go to any chat. Send the `kalpit.me/BBD#…` link instead | Matches his "no affiliate traffic through WhatsApp" call; avoids an Amazon rules risk | ✅ 10 Oct: all items link to kalpit.me/BBD (Kalpit: "kalpit.me/BBD covers everything") |
| A6 | Ask box: when a question names a brand ("Nothing phone under 30k"), lead with that brand's pick | Answers what people actually asked | ⏸ |
| A7 | Gaming laptops | Gap, but small audience among family | ⏸ |
| A8 | Ask-box capacity: free limit is ~80–120 questions a day. Workers paid plan is $5/month for the sale | Only if analytics (C1) show it running out | ⏸ |

## Reach beyond the circle (goal c)
| # | Idea | Why | Status |
|---|---|---|---|
| C1 | **Cookie-free analytics** (Cloudflare Web Analytics): visits, top tabs, where people come from. Plus click counts per pick (counts only, no personal data) | Today there's no tracking at all, so every other choice is a guess | 💬 enable in Cloudflare → Analytics & Logs → Web Analytics, then an agent adds the snippet |
| C2 | **"Share this list with family" button** per tab: opens WhatsApp with the tab link (`kalpit.me/BBD#tv-50000`), no affiliate link | Turns each happy visitor into a sharer | 🔜 |
| C3 | Gift lists (A3) double as shareable content | Reach | 🔜 |

## Affiliate (side benefit)
| # | Idea | Status |
|---|---|---|
| F1 | EarnKaro links for the 37 Flipkart picks (they earn nothing today) | 💬 |
| F2 | Amazon product API for live prices next to affiliate links (needs an eligible Associates account; key lives in Cloudflare, never the repo) | 💬 STATE open ask |
