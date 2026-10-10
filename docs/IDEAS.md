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
| G3 | **Worker builds only when Worker code changes.** Today every push (even "Price check: no changes") rebuilds the ask-box Worker | ✅ 10 Oct (Kalpit set the build watch paths) |
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
| G6 | Amazon evidence bar: affiliate prices need two dated reports, so the 78 banded items rarely get rechecked. Option: let one dated source move a band (bands are ~5–8% wide anyway) | ✅ 10 Oct (Kalpit: yes): price-check skill step 3 |

## Helping friends and family (goal a)
| # | Idea | Why | Status |
|---|---|---|---|
| A1 | **32" and 43" TVs**, and lower the TV slider (now starts at ₹35k) | India's best-selling sizes; most TV buyers find nothing today. The deal scout already sees dated prices | ✅ 10 Oct: Samsung 32", Xiaomi and Samsung 43", plus Sony and Samsung 65" for ₹65k–1.3L; slider starts at ₹10k |
| A2 | **Seasonal picks:** air purifiers (Oct–Nov pollution), geysers and room heaters (winter) | What families actually buy this month | ✅ 10 Oct (Kalpit OK'd): Air purifier (3 Philips) and Geyser (AO Smith 15 L, Havells 3 L) types. Room heaters not yet |
| A3 | **Diwali gifts under ₹1k / ₹2k / ₹5k** (new tab or chips) | Diwali is 8 Nov; gift lists are the most-shared thing | ✅ 10 Oct (Kalpit: yes, new tab): "Diwali gifts" tab, ₹500–5,000 slider, 8 new Flipkart gifts + 6 picks from other tabs (`gift: true`) |
| A4 | **Check the sale end dates before the 20 Oct sunset** | Amazon's festival often runs until Diwali. Switching off early wastes the best weeks | ✅ 10 Oct (Kalpit): site and price check stay on through Diwali, 8 Nov (AGENTS rule 6) |
| A5 | **WhatsApp "Send to myself" text carries the Amazon affiliate link**; with no saved number it opens a contact picker, so it can go to any chat. Send the `kalpit.me/BBD#…` link instead | Matches his "no affiliate traffic through WhatsApp" call; avoids an Amazon rules risk | ✅ 10 Oct: all items link to kalpit.me/BBD (Kalpit: "kalpit.me/BBD covers everything") |
| A6 | Ask box: when a question names a brand ("Nothing phone under 30k"), lead with that brand's pick | Answers what people actually asked | ⏸ |
| A7 | Gaming laptops | Gap, but small audience among family | ⏸ 10 Oct: only RTX 3050 models had confirmed prices at ≤₹85k, skipped as poor value. Premium laptops (₹97k, ₹1.24L) added |
| A9 | **Ask box as a chat:** floating 💬 button (icon near the top, full label once "Also good" scrolls in), full screen on phones (Back closes it), side panel on laptops, "Did this help? 👍/👎" | Easier to find; feels like WhatsApp | ✅ 10 Oct |
| A10 | **"Send to Kalpit" form instead of his WhatsApp:** emailed by the Worker from bbd@kalpit.me; family keep WhatsApp via his private `?f=` link | Hides his number if the site spreads; email can't flood his phone | ✅ 10 Oct (Kalpit: keep it obvious: header button, teaser link, after 👎 / 2nd question / errors) |
| A8 | Ask-box capacity: free limit is ~80–120 questions a day. Workers paid plan is $5/month for the sale | Only if analytics (C1) show it running out | ⏸ |

## Reach beyond the circle (goal c)
| # | Idea | Why | Status |
|---|---|---|---|
| C1 | **Cookie-free analytics** (Cloudflare Web Analytics): visits, top tabs, where people come from. Plus click counts per pick (counts only, no personal data) | Today there's no tracking at all, so every other choice is a guess | ✅ 10 Oct: live via Cloudflare's automatic setup (kalpit.me is proxied). Per-pick click counts, tabs, shares, AI answers: own counter since 10 Oct (private D1 `bbd-stats`, docs/OPS.md → Traffic), incl. daily visitors without an id |
| C2 | **"Share this list with family" button** per tab: opens WhatsApp with the tab link (`kalpit.me/BBD#tv-50000`), no affiliate link | Turns each happy visitor into a sharer | ✅ 10 Oct: one button under "Also good": top 3 picks + tab link, no store links |
| C3 | Gift lists (A3) double as shareable content | Reach | ✅ via C2 on the gifts tab |
| C4 | **"Get sale updates on WhatsApp" button** linking to a WhatsApp Channel Kalpit creates (followers can't see his number, he can't see theirs). "Updates", not "price drops": Amazon policy item 31 bars price alerts on affiliate sites | Visitors have no way back after Diwali; a channel keeps them for the next big sale | ✅ button built 11 Oct, hidden until `channel` is set; 💬 needs his channel link |
| C5 | **Ready-to-post price-drop line in the price-check notification**, for Status, Stories or the channel: exact ₹ only where the page shows one, link only kalpit.me/BBD. Skip Amazon affiliate items (policy item 31) | Every price change becomes a post with no extra work | 💬 |

## Affiliate (side benefit)
| # | Idea | Status |
|---|---|---|
| F1 | EarnKaro links for the 37 Flipkart picks (they earn nothing today) | 💬 |
| F2 | Amazon product API for live prices next to affiliate links (needs an eligible Associates account; key lives in Cloudflare, never the repo) | 💬 STATE open ask |

## Product review, round 3 (10–11 Oct)
Six specialist reviews (page, picks, AI box, trust, engineering, growth). Kalpit ticked what to build.
| # | Idea | Status |
|---|---|---|
| R1 | **Exact product links** instead of store searches (132 of 168 opened a search) | ✅ 11 Oct: 73 of 168 now open the product; the rest stay on search until a link is confirmed (never by opening amazon.in) |
| R2 | **AI box fixes:** the slider was a hard cap even for "S25 or Pixel 10a?"; off-list questions got the tab's picks; "3 L" read as ₹3 lakh; AI ranking differed from the page; the price fixer rewrote offer amounts; cached answers used up the rate limit | ✅ 11 Oct |
| R3 | **Slim AI prompt:** nearby picks + names of the rest, about a third of the old size (~3× more free questions a day) | ✅ 11 Oct (Kalpit OK'd) |
| R4 | **Name the card under the price** ("Includes SBI card offer") and "Without this card, expect up to about 10% more" | ✅ 11 Oct |
| R5 | **One-tap budget chips** under the slider (`quick`), replacing the ₹58k / ₹1.1L tick labels | ✅ 11 Oct |
| R6 | **Quick answers and chat suggestions follow the tab** (no "iPhone 4G or 5G?" on TVs) | ✅ 11 Oct |
| R7 | **Price-check alarm:** the Worker emails Kalpit once a day if `checked` is over 10.5 h old | ✅ 11 Oct |
| R8 | **Family link check** (`FAM_HASH`): a crafted `?f=` link could set a stranger as "Kalpit's WhatsApp" | ✅ built 11 Oct; 💬 needs his family link once to switch on |
| R9 | **Broken links** (`#%E0%A4%A`) blanked the page; typed budgets under the slider did nothing; form said "only Kalpit sees it" | ✅ 11 Oct |
| R10 | **Twin-code check** in the validator (page vs Worker vs validator ranking) | ✅ 11 Oct |
| R11 | **New types** (room heater, tablet, speakers & soundbars) and gap picks (budget washer and fridge, everyday chargers, budget headphones) | ✅ 11 Oct: 13 picks added (Kalpit vetoes); types Room heater, Tablet, Speakers & soundbars |
| R12 | **Better phones above ₹1L** (Kalpit: keep expensive phones, add others) so the ₹1.3–1.6L top pick isn't the Fold7 / iPhone 18 Pro | ✅ 11 Oct: Galaxy S26 Ultra leads ₹1.25–1.6L, Pixel 11 Pro added |
| R13 | Trust line, prominent affiliate note, privacy note (drafts in the review doc) | ⏸ Kalpit left unticked |
| R14 | Move the Gmail-draft step out of the session that can push | ⏸ Kalpit left unticked |
| R15 | Cut list (18 weak picks) and folding the Fitness tab | ⏸ Kalpit left unticked |
| R16 | Ask Amazon Associates India in writing: exact prices next to plain links, and the updates channel | 💬 Kalpit sends (draft in the review doc) |
| R17 | Later ideas: "Deals I'd skip" + "Before you pay" card, cheat-sheet image per budget, family wishlist link, "My card" chips, real-price calculator, no-AI answers for simple questions, Hindi, parent mode | ⏸ |

