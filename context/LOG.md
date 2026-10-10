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
