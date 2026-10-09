# AGENTS.md — Operating manual for AI agents working on BBD

> Read this first, every session, whichever AI tool you are. Claude Code loads it via
> `@AGENTS.md` in CLAUDE.md. Start with `/orient`; end with `/handoff`. Price or pick
> changes: use `/update-picks`.

## What this repo is
**kalpit.me/BBD**: Kalpit's festive-sale recommendations for friends and family
(Amazon Great Indian Festival from 8 Oct 2026, Flipkart Big Billion Days from 9 Oct).
A budget dial ranks picks per category; an "Ask me" box answers follow-up questions
with AI, using only these picks. Kalpit sends change requests by message, often
from his phone. He is a first-time developer: explain terms in plain language,
keep replies short, and lead with what changed.

## ⚠ Pushing to `main` publishes, twice, within about a minute
1. **GitHub Pages** serves `index.html` + `data.json` at https://kalpit.me/BBD/
2. **Cloudflare Workers Builds** redeploys the ask-box Worker (`wrangler.toml` →
   `worker/worker.js`). Its URL is `askUrl` in `data.json`; don't repeat it in notes.

## ⚠ This repo is PUBLIC
Anyone can read every file on GitHub, including `context/` and `docs/`. Never write
friends' names, group names or details, phone numbers, chat excerpts, personal plans,
or secrets anywhere in the repo.
One deliberate exception: Kalpit's own WhatsApp number in `index.html` (`KALPIT_WA`)
for the "Message Kalpit" button. He chose this on 8 Oct, knowing it's public. The WhatsApp chat export never enters the repo.
(`_config.yml` keeps docs off the website, but GitHub still shows them.)

## How to work: intentional differences from Kalpit's other repos
Kalpit's other repos (e.g. Kalpit.me) use feature branches, PRs, a record lane, a
ROADMAP and a guard hook. **BBD deliberately uses none of these.** It's a ~10-day,
one-person project and speed matters.
- **Commit straight to `main`.** No branches, no PRs, no worktrees.
- If your environment forces a branch (e.g. `claude/*`), say clearly in your reply:
  "this change is NOT live until it's on main".
- **Before every push:** `git pull --rebase origin main` (Kalpit may edit from his phone),
  then `node scripts/check-data.mjs`. It must print ✓. Never push on ✖.
- **Never** force-push, amend pushed commits, or rewrite history. (One exception, at
  Kalpit's request: history was squashed to one clean commit on 8 Oct.)
- **Something broke after a push?** Roll back first, investigate second:
  `git revert <sha> && git push`. See `docs/OPS.md`.
- **Done means live-checked:** https://kalpit.me/BBD/ returns 200, `data.json` loads,
  and the Worker answers one question with `"debug": true` (that skips the cache).
- `.github/workflows/check.yml` re-runs the validator after each push and emails Kalpit
  if it fails. It's an alarm, not a gate: the bad version is already live, so revert.

## Rules
1. **Price honesty.**
   - Phones and Flipkart items show exact prices with plain links.
   - `aff: true` items (Amazon affiliate, tag `bestdeallive-21`) show a **price band only**.
     Never write an exact ₹ amount in their `why`, `card` or `faq`.
   - Estimates carry `est: true`.
   - Never invent prices, specs or offers. If a price is unverified, say so to Kalpit.
2. **The AI box recommends only from `data.json`.** Keep the budget cap, the
   over-budget self-correction and the off-list refusal. After any change to
   `worker/worker.js`, re-run the regression questions in `docs/OPS.md`.
3. **Don't touch unless Kalpit asks:** the Worker's SYSTEM prompt wording, `amazonTag`,
   `ALLOWED_ORIGINS` / `DATA_URL` in `wrangler.toml`, and the model list.
4. **No secrets needed, none allowed.** Workers AI needs no API key. Never add a
   Cloudflare or GitHub token to the repo.
5. **Privacy:** a visitor's WhatsApp number lives only in their own browser
   (localStorage). Never log or collect it.
6. **Sunset:** after the sale (around 20 Oct), propose a "Sale's over" banner and turning
   the ask box off. Kalpit decides.

## Why things are the way they are
- **Price bands on affiliate items:** Amazon Associates doesn't allow showing hand-typed
  Amazon prices next to affiliate links. Phones mostly earn no commission, so they use
  plain links and keep exact prices.
- **Workers AI (Gemma 4, Llama 3.3 fallback):** ₹0. No key, no card, and Cloudflare
  doesn't train on questions. The free limit is about 10k neurons a day (roughly 80–120
  questions), resetting at 05:30 IST. When it runs out, the page says "used up, try
  tomorrow" on purpose. Kalpit chose not to fall back to Gemini, whose free tier trains
  on prompts.
- **Gemma answers need `max_tokens` around 1200** because it reasons before replying.
  With less, it returns an empty answer.
- **"Save to my WhatsApp" opens `wa.me/<their own number>`** (message yourself). It isn't
  an affiliate workaround. Kalpit rejected routing affiliate traffic through WhatsApp.
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
- **Flipkart has no affiliate setup yet.** EarnKaro was suggested. If Kalpit sends
  converted links, put them in `url` on Flipkart items.

## File map
```
index.html          the page (dial, picks, ask box, WhatsApp save). Reads data.json
og.png, icon.svg, icon-180.png  WhatsApp link preview image and icons
data.json           ALL content: picks, prices, verdicts, quick answers. Most edits happen here
worker/worker.js    ask-box Worker (Cloudflare). Fetches live data.json
wrangler.toml       Worker config (name bbd-ask, AI binding, vars). Used by Cloudflare's build
scripts/check-data.mjs  validator: run before every push
scripts/deal-scout.mjs  lists new deals from public deal channels (used by price-check)
docs/DATA.md        every data.json field, with worked examples
docs/OPS.md         preview, verify deploys, rollback, ask-box testing, symptom → fix
context/STATE.md    live snapshot: read first, update at the end
context/LOG.md      append-only session log (newest at the bottom)
.claude/skills/     orient, handoff, update-picks, price-check (scheduled every 3h, incl. deal scout)
```
