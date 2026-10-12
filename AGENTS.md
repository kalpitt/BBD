# AGENTS.md — Operating manual for AI agents working on BBD

> Read this first, every session, whichever AI tool you are. Claude Code loads it via
> `@AGENTS.md` in CLAUDE.md. Start with `/orient`; end with `/handoff`. Price or pick
> changes: use `/update-picks`.

## Goals, in order (Kalpit, 10 Oct)
1. **Help friends and family buy well.** Trust is everything.
2. **Reach people beyond his circle.**
Affiliate income is a side effect, never a reason to add, rank or reword a pick. When
two choices conflict, pick the one a first-time buyer would thank you for.

## What this repo is
**kalpit.me/BBD**: Kalpit's festive-sale recommendations for friends and family
(Amazon Great Indian Festival from 8 Oct 2026, Flipkart Big Billion Days from 9 Oct).
A budget dial ranks picks per category; an "Ask me" box answers follow-up questions
with AI, using only these picks. Kalpit sends change requests by message, often
from his phone. He is a first-time developer: explain terms in plain language,
keep replies short, and lead with what changed. When guiding him through a dashboard
(Cloudflare, GitHub), give direct links where possible, then numbered taps.

## ⚠ Pushing to `main` publishes, twice, within about a minute
1. **GitHub Pages** serves `index.html` + `data.json` at https://kalpit.me/BBD/
2. **Cloudflare Workers Builds** redeploys the ask-box Worker (`wrangler.toml` →
   `worker/worker.js`). Its URL is `askUrl` in `data.json`; don't repeat it in notes.

## ⚠ This repo is PUBLIC
Anyone can read every file on GitHub, including `context/` and `docs/`. Never write
friends' names, group names or details, phone numbers, chat excerpts, personal plans,
or secrets anywhere in the repo.
Kalpit's WhatsApp number is no longer on the page (10 Oct, in case the site spreads). Since 12 Oct
"Message Kalpit" is one "DM Kalpit on Instagram" button (@kalpit_tiwari, public) for everyone,
family included, with the email form as a fallback under "No Instagram? Send it by email instead"; no family WhatsApp button. A tap is counted (`dm ig`) and the
3-hourly price check reports the count. Old family links (`?f=<code>`) still open the page and the
page strips the code. Form messages, "Didn't see it?" notes and price reports email him from bbd@kalpit.me
(inbox = the `MSG_TO` secret in Cloudflare, never in the repo). Never write the family code or his number in the
repo (older commits still hold the number; leave history alone). The WhatsApp chat export never enters the repo.
(`_config.yml` keeps docs off the website, but GitHub still shows them.)

## How to work: intentional differences from Kalpit's other repos
Kalpit's other repos (e.g. Kalpit.me) use feature branches, PRs, a record lane, a
ROADMAP and a guard hook. **BBD deliberately uses none of these.** It's a ~10-day,
one-person project and speed matters.
- **Commit straight to `main`.** No branches, no PRs, no worktrees.
- **Cloud sessions are often handed a branch** (`ccr-*`, `claude/*`). This file is
  Kalpit's standing permission to push to `main` instead: commit on `main` and push
  only `main`. Side branches pile up, and agents can't delete them. Only if a push to
  `main` is refused, push the branch and say clearly: "this change is NOT live until it's on main".
- **Before every push:** `git pull --rebase origin main` (Kalpit may edit from his phone),
  then `node scripts/check-data.mjs`. It must print ✓. Never push on ✖.
- **Changed `index.html` or `worker/worker.js`?** Also run `node scripts/smoke.mjs`
  (opens the page in a headless browser). It must print ✓. `data.json`-only edits skip it.
  No Playwright in your tool? Say so in your reply and keep the change small.
- **Kalpit says "undo"**: revert his or your last change (not a `Price check:` commit)
  with `git revert`, push, and tell him what came back.
- **Never** force-push, amend pushed commits, or rewrite history. (One exception, at
  Kalpit's request: history was squashed to one clean commit on 8 Oct.)
- **Something broke after a push?** Roll back first, investigate second:
  `git revert <sha> && git push`. See `docs/OPS.md`.
- **Done means live-checked** per `docs/OPS.md` → Verify (GET requests only). Send a
  real `"debug": true` question only after changing `worker/worker.js` (it spends the
  free AI allowance).
- `.github/workflows/check.yml` re-runs the validator and the smoke test after each push
  and emails Kalpit if either fails. It's an alarm, not a gate: the bad version is
  already live, so revert.

## Adding picks: veto, not approve (since 10 Oct)
Agents (chat and the price check) may add a pick without asking, then tell Kalpit; he
replies "keep" or "remove X". What makes a good pick, who decides what, and the exact
limits: **`docs/PICKS.md`** (read it before adding). The validator enforces the limits.

## Rules
1. **Price honesty.**
   - Phones, Flipkart items and low-commission Amazon items show exact prices with plain links.
   - Amazon items get `aff: true` only if they earn about **₹250+ per sale** (price × category
     rate; table in `docs/DATA.md`). Kalpit's call, 10 Oct: exact prices for most items.
   - `aff: true` items (Amazon affiliate, tag `bestdeallive-21`) show a **price band only**.
     Never write an exact ₹ amount in their `why`, `card` or `faq`.
   - Estimates carry `est: true`.
   - Store buttons open the exact product when `url` is set (Kalpit, 11 Oct): affiliate items use a
     clean `amazon.in/dp/<ASIN>` link and the page adds the tag. Add a link only when the model and
     variant are confirmed; otherwise the button opens a store search.
   - **Never open amazon.in with tools** (curl, WebFetch, a browser): Amazon's Associates policy
     item 27 bars software sessions on its site. Item 31 bars price alerts on affiliate sites, so
     the WhatsApp Channel is for sale updates, and price-drop posts skip Amazon affiliate items.
   - Never invent prices, specs or offers. If a price is unverified, say so to Kalpit.
2. **The AI box recommends only from `data.json`.** Keep the budget cap, the
   over-budget self-correction and the off-list refusal. After any change to
   `worker/worker.js`, re-run the regression questions in `docs/OPS.md`.
3. **Don't touch unless Kalpit asks:** the Worker's SYSTEM prompt wording, `amazonTag`,
   `ALLOWED_ORIGINS` / `DATA_URL` in `wrangler.toml`, and the model list.
4. **No secrets needed, none allowed.** Workers AI needs no API key. Never add a
   Cloudflare or GitHub token to the repo.
5. **Privacy:** a visitor's WhatsApp number lives only in their own browser
   (localStorage). Never log or collect it. Instagram DMs happen in Instagram; the page only
   counts the tap. The reply contact a visitor types into the email form goes only into the email
   to Kalpit; the Worker never logs or stores it. Visit counts (private D1 `bbd-stats`, docs/OPS.md → Traffic) store
   counts per day only: never add an IP, visitor id, cookie or question text to them, and
   never add a public way to read them (Kalpit, 10 Oct: keep them private).
6. **Sunset (Kalpit, 10 Oct):** the site stays live **through Diwali, 8 Nov 2026**, with
   the 3-hourly price check running until then. On 9 Nov, ask Kalpit: a "Sale's over"
   banner and the ask box off, or take the site down.
7. **Twin code:** `nameIndex()`/`mentions()`, `big()`, `cardText()`, the price band (`bandRange()`), the
   budget reader (`budgetFrom()` with `HINDI_NUM`/`NOT_MONEY`) and the ranking (`rankAt()`) exist in both
   `index.html` and `worker/worker.js` (ranking also in `scripts/check-data.mjs`).
   Change all copies or none. The validator compares them and fails if they drift.
8. **Videos (Kalpit, 10 Oct):** every video follows John Lasseter's animation principles
   and the same price honesty (real picks, bands for affiliate items, real AI answers,
   no count-ups). Use `/promo-video` (`.claude/skills/promo-video/`).

## Why things are the way they are
- **Price bands on affiliate items:** Amazon Associates doesn't allow showing hand-typed
  Amazon prices next to affiliate links. Phones and other low-commission items (under
  ~₹250 per sale) use plain links and keep exact prices; only big earners keep the band.
- **Workers AI (Gemma 4, Llama 3.3 fallback):** ₹0. No key, no card, and Cloudflare
  doesn't train on questions. The free limit is about 10k neurons a day (roughly 80–120
  questions), resetting at 05:30 IST. When it runs out, the page says "used up, try
  tomorrow" on purpose. Kalpit chose not to fall back to Gemini, whose free tier trains
  on prompts.
- **Gemma answers need `max_tokens` around 1200** because it reasons before replying.
  With less, it returns an empty answer.
- **"Save to my WhatsApp" opens `wa.me/<their own number>`** (message yourself). It isn't
  an affiliate workaround. Kalpit rejected routing affiliate traffic through WhatsApp, so
  since 10 Oct the message links only to kalpit.me/BBD (the pick's tab and price), never
  to a store, for Amazon and Flipkart alike.
- **Lowercase `/bbd`** is a redirect in the Kalpit.me repo (branch `add-bbd-redirect`).
  Share `kalpit.me/BBD`.
- **The picks are Kalpit's own.** Inspiration and price checks come from the official
  Flipkart and Amazon sale cheat sheets, two YouTube recommendation videos, @r3dash's
  deal threads and pricebefore.com (all credited in `README.md` → Credits; add any new
  helper there). Kalpit's own calls always win:
  - iPhones are toned down: discounts are small this year, so they're for existing
    iPhone users only.
  - If prices are equal, Amazon is preferred for service reliability.
  - Don't re-add the OnePlus N6 (Kalpit doesn't like it).
  - Don't add "buy second-hand" advice.
  - 2026 prices are higher than July for many models (memory costs from the AI
    boom), so most picks are framed as best value at today's prices. "Lowest price" /
    "all-time low" is fine for a specific product when price history backs it (e.g.
    pricebefore.com). Kalpit dropped the blanket ban on 8 Oct.
- **Only add a phone with a real price** from a cheat sheet, Kalpit, or a dated sale
  report. A model with no verified BBD price is skipped, or added as `est: true` with
  a `max` range when Kalpit wants it listed (e.g. Vivo X200T, Motorola Edge 70).
- **Ranking is score + budget fit** (`rankAt()`; twin code, rule 7). A pick's `score` decides
  where it hands over to the next one on the dial. Before changing a score, simulate every
  budget in the tab and tell Kalpit what moves (10 Oct: S25 Ultra 10, S25 FE 8; the OnePlus
  13s lost the ₹53–55k slot). `altScore` (`{"camera": 9}`) changes only the "Best camera" /
  "Lasts longest" cards, so it isn't twin code (Nothing Phone (4a) Pro, docs/DATA.md).
- **Ask box is a chat (10 Oct):** floating button, full screen on phones with Back closing it
  (pushState; the smoke test checks it), side panel on laptops. "Message Kalpit" is
  deliberately easy to find (header button, teaser link, after 👎 / 2nd question / errors):
  it goes to email, so volume is fine.
- **Price check runs on Sonnet (Kalpit, 10 Oct)** in a long-running session the Routine wakes
  ("BBD price checker, Sonnet"). Routines that start a fresh session each run can't get
  push access to this repo (tested 10 Oct), so don't switch to that. Old Routines are
  paused, not deleted. **Since 12 Oct each run happens inside one subagent** and the session
  keeps only its short report, so its memory grows ~3k tokens per run instead of ~25k.
  The Routine's prompt has it check its own memory each run and, past 500k tokens, start
  its own successor (new session + new Routine, old Routine paused) or tell Kalpit if it can't.
  Rotated by hand on 12 Oct (the first session reached ~360k).
- **The ask box sends only the picks that fit (11 Oct, Kalpit OK'd):** `planAnswer()` gives the AI
  the picks near the budget (or the products the question names) plus the names of the rest,
  about a third of the old prompt, so the free tier covers roughly 3× more questions. A budget
  typed in the question is a hard cap; a question naming products ("S25 or Pixel 10a?") is
  answered as asked; an unclear question gets the visitor's tab as context with no forced pick.
  The SYSTEM prompt now sends outsiders to "Message Kalpit", not the WhatsApp group.
- **Price-check alarm (11 Oct):** the ask Worker runs every 3 hours (`wrangler.toml` `[triggers]`)
  and emails Kalpit (`MSG_TO`, subject "BBD alarm") once a day if `checked` is over 10.5 hours old.
- **Instagram DM for everyone (Kalpit, 12 Oct):** he wasn't ready to run a WhatsApp Channel, and
  replaced the family WhatsApp link (and its `FAM_HASH` check) with one Instagram DM button. The
  email form came back the same day as the fallback: Gmail saves, alerts and gets drafted replies. Instagram links can't carry text, so a tap copies the page link and the
  visitor's last question to paste. The DM itself can't be seen or saved; only taps are counted.
- **Flipkart has no affiliate setup yet.** EarnKaro was suggested. If Kalpit sends
  converted links, put them in `url` on Flipkart items.

## File map
```
index.html          the page (dial, picks, ask box, WhatsApp save). Reads data.json
og.png, icon.svg, icon-180.png  WhatsApp link preview image and icons
data.json           ALL content: picks, prices, verdicts, quick answers. Most edits happen here
worker/worker.js    ask-box Worker (Cloudflare). Fetches live data.json; also visit counts (/hit → D1 bbd-stats)
wrangler.toml       Worker config (name bbd-ask, AI binding, vars). Used by Cloudflare's build
scripts/check-data.mjs  validator: run before every push
scripts/smoke.mjs   headless-browser check of the page: run before pushing index.html/worker changes
scripts/deal-scout.mjs  lists new deals from public deal channels (used by price-check)
docs/DATA.md        every data.json field, with worked examples
docs/OPS.md         preview, verify deploys, rollback, ask-box testing, symptom → fix
docs/PICKS.md       what makes a good pick; who may add what; auto-add limits
docs/IDEAS.md       improvement ideas from the 10 Oct strategy review, with status
context/STATE.md    live snapshot (≤ 50 lines): read first, overwrite at the end
context/LOG.md      append-only session log (newest at the bottom)
.claude/skills/     orient, handoff, update-picks, price-check (scheduled every 3h, incl. deal scout),
                    promo-video (code-made promo video + its source in src/)
```
