# LOG: append-only, newest at the bottom

One entry per session. Note decisions and gotchas, not just tasks. Never edit old
entries. Public repo: no names, numbers or chat content.

Template:
```
## YYYY-MM-DD: short topic
- Did:
- Decided:
- Gotchas:
- Next:
```

## 2026-10-07: site built and launched
- Did: built kalpit.me/BBD (direction "Budget Dial" chosen over a chat-style page);
  data from the Flipkart and Amazon cheat sheets plus web research; deployed the ask-box
  Worker through Cloudflare Workers Builds; wrote this governance.
- Decided: Amazon affiliate items show price bands only (Associates price rule); phones
  use plain links with exact prices; Workers AI only, no Gemini fallback; direct to main,
  no PRs; no guard hook.
- Gotchas: Cloudflare first deployed the repo as static files until a root
  `wrangler.toml` was added. Gemma returned empty answers until max_tokens was raised
  to 1200 (it reasons first). The regex `\bac` matched the Hindi word "achha", so it now
  uses `\bac\b`. GitHub Pages paths are case-sensitive (`/bbd` vs `/BBD`).
- Next: see STATE.md open asks.

## 2026-10-07 (late): picks cross-checked against two YouTube videos
- Did: removed OnePlus N6; added realme P4 Power, Mivi One 5G, Vivo X200T (est), Motorola
  Edge 70 (est), OnePlus 13s, iQOO Z11, Poco M8x, HMD Vibe2/Vibe2 Pro; retuned Edge 70 Pro,
  Signature, P4x, Nothing (4a) (camera pick under ₹35k), S25 Ultra (₹84,999 sale price).
  Toned down all iPhones. Added quick answers: 4G vs 5G check, iPhones not a great deal,
  Amazon preferred when prices are equal. Page and Worker now show "₹X–Y" for
  non-affiliate estimates.
- Decided: Kalpit's standing calls are recorded in AGENTS.md ("Where the picks come
  from"). Models without a verified BBD price are skipped.
- Gotchas: the AI ignored the shortlist order until the prompt named "KALPIT'S TOP PICK"
  explicitly. data.json edits must keep one product per line; scripted edits should do
  text replacement, not a full json.dump (which reformatted ~1,500 lines).
- Next: see STATE.md.

## 2026-10-08: content consistency audit
- Did: raised TV ranges to match Amazon's early-deal prices (our earlier estimates were
  too low); TV slider now 35–70k labelled "55-inch"; added MacBook Neo (est, affiliate);
  laptop slider capped at 70k with a note; removed an unverified "front load" claim;
  removed "half its listed price" and "biggest drop" claims; softened the
  "wait for Diwali?" quick answer.
- Gotchas: only use dated 2026 sources. Several search hits were 2023/2025 sale
  articles and were ignored.

## 2026-10-08: review fixes (ask box, share links, preview)
- Did: product-name matching rewritten (same code in Worker and page): longest name
  wins, short forms two picks share match neither. Fixes extra cards (Nothing 4a/4b,
  Book4 i3/i5/i7, S25/S25 Ultra) and false over-budget retries. Cache key includes
  `updated`. "Expected" + store shown for estimates everywhere. Hash share links,
  og.png + icons, more phone brands in `bestMatches()`, 45s ask timeout, aria-live.
- Decided: matcher is duplicated (Worker + page), not a shared file, to avoid changing
  the Cloudflare build. Keep both copies in sync (docs/OPS.md).
- Gotchas: regression-tested by diffing 650 page views old vs new (only intended
  change), a mocked-AI Worker harness, and the 6 live questions in OPS.md (all pass).
  Plain visits now rewrite the URL to `#phones-25000`; that's intended.
- Next: see STATE.md.

## 8 Oct, 12:00 pm: discount layers
- Built discount layers (`was`/`list`/`coupon`/`bank`), "How you get this price"
  breakdown, 🔥 Big deal badge + chip + ranking boost (page and Worker), validator check,
  docs, and price-check instructions. Backfilled 13 items; Ray-Ban and WalkPad are big deals.
- Tested: validator error cases, Worker product lines with mocked fetch (no ₹ in offer
  labels), page in Chromium (chip, hash `-deals`, breakdown). Ask-box regression questions
  not run yet: the Worker change isn't on main.
- Pushed to the session branch, not main (environment forced a branch).

## 8 Oct, afternoon: live + normal prices + WhatsApp contact
- Discount layers pushed to main (Kalpit approved). WalkPad verdict no longer says
  "lowest price". "Message Kalpit on WhatsApp" link under the Ask box (his number is
  public by his choice; noted in AGENTS.md).
- `was` for 9 items from pricebefore.com (method in docs/DATA.md). 5 big deals now.
- Phones: Sonnet subagent hunted pricebefore histories; main session re-parsed key pages
  and applied `was` to 8 high-confidence phones. Vibe2 now a big deal.

## 8 Oct, 1:30 pm: repo cleanup before sharing
- Did: added a Credits section to README (the picks are Kalpit's; sources credited as
  inspiration); reworded source mentions in notes; removed the Worker URL from notes
  (it lives only in `askUrl` in data.json); squashed history to one clean commit with
  Kalpit's GitHub noreply email, deleted the old `ccr-*` branches.
- Decided: one-time history rewrite at Kalpit's request. The no-force-push rule stands.
- Gotchas: `git pull --rebase` in an old clone is safe (it skips the rewritten commits);
  a plain `git pull` (merge) is not, since it would bring the old history back.

## 8 Oct, 2:30 pm: kalpit.me moved to Cloudflare DNS; Ask box on ask.kalpit.me
- Did: kalpit.me nameservers moved from Porkbun to Cloudflare (records copied, all
  DNS-only; Porkbun email forwarding kept via MX). Kalpit added the Custom Domain
  ask.kalpit.me to the Worker in the dashboard. Page now calls `askUrl` and retries
  `askFallback` (old address) only on a network error.
- Decided: keep the fallback for 24h because some ISPs cache the old nameservers.
- Next: ~9 Oct afternoon remove `askFallback` from data.json, then Kalpit disables
  workers.dev under bbd-ask → Settings → Domains & Routes.

## 2026-10-08 (4:45 pm): handoff: repo cleanup, credits, DNS move
- Did: reviewed the repo for exposure before Kalpit shares it (no secrets found); added
  README credits and reframed source mentions; squashed history to one commit (backup
  bundle given to Kalpit); moved DNS to Cloudflare; Ask box on ask.kalpit.me with a 24h
  fallback; scheduled the fallback-removal reminder.
- Decided: picks are presented as Kalpit's own, with sources credited, not hidden.
  The real way to retire the old Worker URL is disabling workers.dev, not editing history.
- Gotchas: Worker custom domains need the zone on Cloudflare (Porkbun DNS couldn't do it).
  Agents can't delete GitHub branches or change a Routine's prompt from another chat.
  Worker builds were already failing before this session; see STATE open ask 5.
- Next: see STATE.md "Next steps".

## 2026-10-08 (6:45 pm): design refresh, review panel, live
- Did: built a live design-samples page; Kalpit picked night sky + diyas, sparks, glowing
  pick card, slider pick dots, laptop sidebar layout, category icons, freshness pill,
  scratch card on shared links, Share as Status image, chat-style Ask box. Built it on a
  branch, ran a 5-reviewer panel (visual, mobile perf, a11y, trust/compliance, shopper
  personas), applied fixes, then fast-forwarded main on Kalpit's "push to main".
- Decided: experience for ordinary visitors wins over a11y extras (no bigger chips/text);
  no quick-budget buttons; cream icons; "pick under ₹X" on the Status image; new
  `checked` stamp so "Prices checked" is honest; "lowest price" wording allowed per
  product when price history backs it (blanket ban dropped); Ask box never states one
  number for affiliate items (Kalpit approved the prompt change).
- Gotchas: snapping the slider to an affiliate item's exact price leaked that price into
  the budget box, URL and Status image; dots now use the band top. The star canvas cost
  ~19% CPU on a throttled phone until drawn at 1x, thinned and stopped after 20 s. A CSS
  `scale` animation on a box-shadow layer drew a visible frame around the card; animate
  opacity only. `.hero.moving{animation:slot}` silently replaced the orbit animation, so
  both must be listed together. WhatsApp's in-app browser often can't share files or
  download, hence the press-and-hold popup.
- Next: confirm the Worker build; explore the old Amazon affiliate account in a new chat.

## 2026-10-09: Ask box fallback removed
- Did: public DNS (Google, Cloudflare) shows Cloudflare nameservers and resolves
  ask.kalpit.me, so `askFallback` was removed from data.json and the notes.
- Decided: the page's retry loop stays (it's harmless with one URL, and reusable if a
  backup address is ever needed).
- Next: Kalpit turns off workers.dev for bbd-ask.

## 2026-10-09 (10 pm): deal scout added to the price check
- Did: tested whether an agent can watch social media for deals. X needs login or a paid
  API (~$0.005 per post read), and Reddit blocks cloud reads and needs API approval.
  Most deal websites block cloud reads too. Public Telegram previews (`t.me/s/<name>`) work and are
  minutes fresh. Built `scripts/deal-scout.mjs` (7 channels, category tags, store from
  links, repost dedupe) and step 4b in the price-check skill: up to 3 suggestions per run
  in the phone notification, including new kinds of product. Never edits picks.
- Decided (Kalpit): new products only, same notification as the price check, include
  kinds the site doesn't list yet.
- Next: watch the first few notifications; if they're noisy, tighten `RULES`/`SKIP` or
  drop a channel. Possible add: pricehistory.app category lows (see docs/OPS.md).

- 10 Oct 2:35 am (price check): HMD Vibe2 5G 10,499 → 11,399 (Flipkart listing, after bank offer, steady for a day).
- 10 Oct 4:55 am: added Xiaomi 65" X Pro QLED, iFFALCON 65", ECOVACS N30 (new Home type: Robot vacuum), from deal-channel posts. MX Master 3S 5,795 → 4,416; Vivobook 15 firmed at 41,740 (Core 3, 8GB/512GB, Amazon). Desk slider min 4,000.
- 10 Oct 5:40 am (price check): HMD Vibe2 11,399 → 11,999. Fix: 11,399 was listing minus the co-branded 5%, which the page shows separately.

## 2026-10-10: strategy review, governance first
- Did: strategy review of the site and the way it's run; all ideas saved in
  docs/IDEAS.md with status. Governance changes: "veto, not approve" rule for adding
  picks (AGENTS.md, price-check 4b, `auto` field); `scripts/smoke.mjs` headless page
  check; validator syntax-checks `index.html`; push to `main` only from cloud sessions;
  STATE cut from 142 to under 50 lines (old version stays in git history).
- Decided (Kalpit): goals are (a) help friends and family buy well, then (c) reach
  beyond his circle; affiliate income is a side benefit. Agents and the price check may
  add up to 2 picks per run without asking, then tell him.
- Gotchas: every push, even "Price check: no changes", rebuilds the Worker until build
  watch paths are set in Cloudflare. `pkill -f <pattern>` inside a Bash call can kill
  that same shell when the pattern appears in the command.
- Next: Kalpit's dashboard steps (watch paths, Web Analytics); then 32/43-inch TVs and
  seasonal picks (IDEAS A1, A2).

## 2026-10-10 (10:30 am): governance review round 2, four reviewers
- Did: four parallel reviews (agent workflow, risk, goal fit, tooling). Applied: goals
  at the top of AGENTS.md; new docs/PICKS.md (good pick, who decides, auto-add limits);
  validator enforces those limits plus affiliate-price, link, stamp, duplicate-name and
  leak checks; smoke test covers slider ends and the scratch card and runs in CI;
  update-picks handles "add X", "keep", "remove X", "undo"; price check focuses on top
  picks, respects Kalpit's prices, stamps `checked` at most every 6 h, no LOG lines.
- Decided: auto picks capped at 4 waiting (tightens Kalpit's 2-per-run rule; trust
  first). Not done without Kalpit: Routine schedule, a git-push hook in
  `.claude/settings.json`, the WhatsApp affiliate link (A5).
- Gotchas: the written "±20% score" rule was looser than the page's real ranking; the
  validator now replays the ranking at every budget. A reload skips the scratch card,
  so smoke tests it on a fresh page.
- Next: Kalpit's dashboard steps; 32/43-inch TVs.

## 2026-10-10 (9:48 am): price-check schedule, WhatsApp links
- Did: price-check Routine now runs at 9:05 am, 12:05, 3:05, 6:05, 9:05 pm and 12:05 am
  IST (was every 3 h around the clock). "Send to myself on WhatsApp" now links each pick
  to its kalpit.me/BBD view (tab + price; band top for affiliate items), no store links.
- Decided (Kalpit): prices change at midnight, so keep a 12:05 am run; kalpit.me/BBD
  covers everything, so no Amazon or Flipkart links in WhatsApp; no pre-push hook.
- Next: Kalpit's Cloudflare steps (build watch paths, Web Analytics snippet).
- 10 Oct 10:05 am: Kalpit set the Worker build watch paths, turned off workers.dev
  (now 404; ask.kalpit.me answers), and found Web Analytics already live for kalpit.me
  via automatic setup (site is now proxied through Cloudflare). He prefers direct links
  when guided through dashboards (AGENTS.md).

## 2026-10-10 (10:08 am): handoff: strategy and governance session
- Did: strategy review (docs/IDEAS.md); two governance rounds (goals first, docs/PICKS.md,
  validator-enforced auto-add limits, smoke test in CI, short STATE); price-check schedule
  9:05 am to 12:05 am; WhatsApp self-send links to kalpit.me/BBD only. Kalpit set the
  Worker build watch paths, turned off workers.dev, deleted the old branches; Web
  Analytics turned out to be live already.
- Decided: goals (a) friends and family, (c) reach; affiliate is a side effect. No
  pre-push hook. Direct links when guiding Kalpit.
- Gotchas: TV and sale-date research was started and stopped unfinished at Kalpit's
  request; nothing from it was used. Redo it in the next chat.
- Next: STATE.md "Next steps".
- 10 Oct 10:10 am: added Xiaomi 55" 4K QLED (29,987 after coupon + SBI) and Bosch 302 L triple-door fridge (22,240), from deal-channel posts. TV slider min 35k → 10k.
- 10 Oct 10:28 am: affiliate cut-off (Kalpit, option 2). Amazon items keep `aff: true`
  (price band) only at ~₹600+ commission per sale; 41 picks switched to plain links with
  exact prices (0% items: MacBook, microwaves, OnePlus/realme earbuds; small earners:
  chargers, accessories, Echo/Fire TV; ₹250–600: premium audio, chimneys, cheaper washers,
  monitor, T7, Osmo, WalkPad, Bosch 302 L). 39 affiliate picks left. Rate table in docs/DATA.md.
- 10 Oct, 10:33 am: Kalpit moved the cut-off back to ~₹250 per sale. The 19 picks earning ₹250–600
  (premium audio, chimneys, cheaper washers, monitor, T7, Osmo, WalkPad, Bosch 302 L)
  are affiliate bands again. 58 affiliate, 82 exact-price picks.

## 2026-10-10 (10:38 am): handoff: affiliate cut-off
- Did: pulled the official Amazon Associates India fee schedule (Oct–Nov 2026) and sorted
  all Amazon picks by commission per sale. Tried a ₹600 cut-off, then settled on ₹250:
  22 picks (0% or small earners) now show exact prices with plain links; 58 keep bands.
  Rule and rate table in docs/DATA.md; AGENTS rule 1, PICKS.md, update-picks point to it.
- Decided (Kalpit): exact prices on most items; affiliate band only where an Amazon item
  earns about ₹250+ per sale. Phones and Flipkart unchanged.
- Gotchas: 0% surprises: all microwaves, semi-auto washers, Apple, audio under ₹3,000 MRP
  (MRP, not sale price), and earbuds from OnePlus/realme/Xiaomi and other listed brands.
  Amazon pays on the whole 24-hour cart after an affiliate click, so a plain link can
  also lose commission on other items bought in that visit. Echo/Fire rate not listed.
- Next: STATE.md "Next steps".

## 2026-10-10 (11:15 am): portfolio fill: TVs, laptops, purifiers, geysers
- Did: on Kalpit's ask ("TVs and other important products for all price ranges"), added
  15 picks, prices read from the Flipkart/Amazon listing pages: Samsung 32" (11,934),
  Xiaomi F 43" (19,499), Samsung Crystal 43" (23,540), Sony Bravia 2 II 65" (68,249),
  Samsung QN70F 65" Mini LED (88,749), HP OmniBook X Flip 14 (Amazon, band), MacBook Air M5
  16/512 (1,24,380), Philips AC0920/AC1711/AC3221 purifiers, AO Smith 15 L and Havells
  Carlo 3 L geysers, Eureka Forbes S2 vacuum, Dell SE2726D 27" and Acer SA242Y E 24".
  New Home types `purifier`, `geyser`; laptop slider max 85k → 1.3L. Worker `catHint` and
  deal scout now map purifier/geyser/vacuum. All 6 regression questions + 2 new pass.
- Decided (Kalpit): these count as his picks (no `auto`, no 2-per-chat limit); new types OK.
- Gotchas: no 512GB laptop under ₹35k had a confirmed price; gaming laptops at ≤85k are
  RTX 3050 only, skipped as poor value. Amazon blocks scripted /dp/ pages; /gp/aw/d/<ASIN>
  with an iPhone UA sometimes works. LG C5 OLED's sale listing sat above its Sept price.
- Next: STATE.md "Next steps".

## 2026-10-10 (11:10 am): docs after the portfolio fill
- Did: IDEAS A1 (32/43" TVs) and A2 (purifiers, geysers) marked done, A7 notes why no
  gaming laptop; PICKS.md examples moved off filled slots; laptop tab note now says
  "everyday, office and premium". STATE notes the phone cards commit (cc130d8) from
  another chat that landed during this one.
- Gotchas: the previous entry's "11:15 am" was a guess; the real time was about 11:00 am.
  Check `TZ=Asia/Kolkata date` before stamping.
- Next: STATE.md "Next steps".

## 2026-10-10 (11:10 am): Best camera / Lasts longest cards, Lasts long filter (Kalpit)
- Did: phones show two more cards under the main pick when no filter is chosen ("Best
  camera", "Lasts longest"; `alts` on the phones category). New `lasts` tag and filter:
  flagship-class chip + any IP rating + wide service (Samsung, Apple, Vivo/iQOO,
  Xiaomi/Redmi/Poco), metal a plus. 13 phones tagged. `spec` (chip, IP, frame) on all 37
  phones from ₹20k, from GSMArena/brand pages; frame left out for 5 with no source.
  Pixel 10a score 9 → 6, verdict names heat and thin service, `parents` removed.
  Worker: `lasts` use hint + specs in the product lines. All 6 regression questions pass.
- My calls, for Kalpit to veto: no `lasts` for OnePlus (thinner service), Motorola, Pixel,
  Nothing, or the Fold7 (IP48, hinge).

## 2026-10-10 (11:15 am): Kalpit kept the 15 new picks
- Decided (Kalpit): "keep" on all 15 picks from the portfolio fill. They had no `auto`
  tag, so data.json is unchanged; only the open ask is cleared from STATE.
- Next: STATE.md "Next steps".
- 11:14 am follow-up (Kalpit): OnePlus counts as wide service (Oppo merger), IP48 is fine
  for a foldable: `lasts` added to OnePlus 13s, Nord 6, Fold7. Edge 70 Pro stays the pick;
  its verdict now names thin Moto service and the S25 FE stretch.

## 2026-10-10: handoff: phone cards and Lasts long
- Did: see the 11:10 am entry and its follow-up above (cards, filter, specs, Pixel 10a).
- Decided (Kalpit): English labels only. "Lasts long" = powerful chip + any IP rating +
  wide service in tier 2–3 towns; metal a plus, updates matter little. OnePlus counts
  (Oppo service); IP48 is fine. Pixel 10a: Tensor chip heats up, weak small-town service.
  Edge 70 Pro may lead, with the service caveat and the S25 FE stretch in its verdict.
- Gotchas: specs for 2026 phones came from GSMArena/brand pages via a research subagent;
  sources disagree on some frames, so `frame` is left out when unconfirmed (validator
  allows that). The page ignores hash-only URL changes (reload to test a #view).
  The alt cards sit outside the scratch card, so a shared link shows them before the reveal.
- Next: STATE.md "Next steps".

## 2026-10-10 (11:35 am): Kalpit's answers; gifts tab, share button, Diwali sunset
- Decided (Kalpit): yes to Diwali gifts tab (A3, new tab, up to ~8 new gifts), "Share
  with family" button (C2), one dated report moves an affiliate band (G6). Site and
  price check stay on through Diwali, 8 Nov (AGENTS rule 6). Unknown phone frames are
  plastic (Redmi Note 15 Pro+, Redmi Note 17 Pro, Vivo T5 Pro, Nord CE6 Lite, iQOO Z11xa).
- Did: gifts tab (`gifts` category, `gift: true` pulls picks from other tabs; twin code
  in index.html, worker.js, check-data.mjs). 8 Flipkart gifts, prices read on the
  listings (no bank offer checked). Share button: top 3 + tab link, no store links.
  `was` for Eureka S2, Philips AC1711, Samsung 43". Worker: gift questions → gifts
  tab; all 7 regression questions pass (new #7 gift question).
- Gotchas: pricebefore's catalogue is thin for 2026 models; most new picks have no
  Sep history. Gift picks are not `auto` (Kalpit OK'd the batch), but he can still veto.
- Next: STATE.md "Next steps".

## 2026-10-10 (11:55 am): Kalpit's prices from screenshots
- Prices (Kalpit, final): Vivo X200T ₹60,000 (no bank offer); LG 55" ₹35,240,
  Samsung 55" Mini LED ₹39,840, TCL 55" T8D ₹40,490 (SBI + coupon layers, no ₹300
  cashback); IdeaPad Slim 3 → i7-13620H 16/512 ₹66,490 (SBI); Moto G37 Power ₹15,499,
  G06 Power ₹12,999. Motorola Edge 70 doesn't exist: removed, added to `removed`.
- Unsure: the ₹40,990 TV screenshot had no title; assumed LG NU87.

## 2026-10-10 (12:00 pm): Kalpit keeps all gifts
- Decided (Kalpit): "keep everything on gifts" (8 new gifts + 6 gift-tagged picks). No `auto` flags, so data.json is unchanged.

## 2026-10-10 (12:00 pm): handoff: gifts, share button, Kalpit's prices, laptop hunt
- Did: see the 11:35, 11:55 am and 12:00 pm entries above (gifts tab, share button,
  Diwali sunset, G6, frames, `was` ×3, Kalpit's screenshot prices, Edge 70 removed).
- Decided (Kalpit): the untitled ₹40,990 TV screenshot is the LG 55" NU87 (confirmed).
  Outside phones he prefers Amazon (service, and affiliate as a side benefit).
- Laptop under ₹40k, must be a big deal: research found none that honestly qualifies.
  Flipkart card offers are only ~5–6% (test "card > 12%" fails). The 25%-below-`was`
  candidates fail the `was` rule: HP 15s R5 and IdeaPad 3 i3 sat at MRP on 1–20 Sep;
  IdeaPad Slim 1 R5's "Sep low" ₹59,671 is above its own MRP (₹47,290), so it's a
  mismatched or inflated listing, and its ₹38,559 needs a Flipkart co-branded card
  (₹41,099 otherwise). Amazon: no model had two agreeing dated reports. Nothing added.
- Gotchas: a pricebefore "Sep low" above MRP or equal to MRP is not a real `was`.
  Python string replace on STATE's first paragraph broke its header; rewrite STATE whole.
- Next: STATE.md "Next steps".
