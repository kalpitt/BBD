# STATE: where BBD is right now

_Last updated: 11 Oct 2026, 5:40 am IST. Overwrite at the end of every session; keep it
under 50 lines. Round-3 review and what shipped: docs/IDEAS.md → Product review, round 3._

## Live
- https://kalpit.me/BBD/: 182 picks, 8 tabs; new types Room heater, Tablet, Speakers & soundbars.
  73 of 182 store buttons open the exact product (`url`), the rest a store search.
  One-tap budget chips; card named under prices; quick answers and chat ideas follow the tab.
- Ask box is a chat: floating 💬 button, full screen on phones, side panel on laptops,
  👍/👎 under answers. "Message Kalpit" (header, teaser, after 👎 / 2nd question / errors)
  opens a form the Worker emails to him from bbd@kalpit.me (`MSG_TO` secret). His WhatsApp
  is off the page; family use his private `?f=` link (never in the repo).
- Phones: S25 FE top ₹45–55k, S25 Ultra top ₹85k–1.25L, S26 Ultra ₹1.25–1.6L (11 Oct), Pixel 11 only ₹70–85k. Nothing
  Phone (4a) Pro (₹49,999) is the "Best camera" card at ₹50–55k via `altScore`.
- Price check: Routine "BBD price check, Sonnet (9:05 am to 12:05 am, every 3h)" wakes the
  Sonnet session "BBD price checker, Sonnet". Old Opus Routine and a fresh-session test
  Routine are paused (fresh sessions can't push). Details: AGENTS.md → Why things are.
- Visitor feedback (12 Oct): "Didn't see what you wanted?" box under the list (shows matching picks
  as they type; note emailed as "BBD wish"). Back from a store → "Did <pick> look right?" (✅ 🛒 ❌ 💸 🔗,
  counted as `report`; 2+ problems on a pick in a day email "BBD problem"; ❌ offers the other store
  and the next pick). Silent drop-offs counted as `left view~budget`. Price check checks flagged picks first.
- Visit counts: private D1 `bbd-stats` (docs/OPS.md → Traffic). Kalpit: `?nostats` on his devices.
- Cloudflare: Web Analytics (path `/BBD`), Email Routing; Worker rebuilds only on `worker/*`/`wrangler.toml`.
- Ask box (11 Oct): slim prompt via `planAnswer()` (~1/3 size), typed budget = cap, named
  products compared, affiliate prices forced to bands in `fixPrices()`. 10 regression Qs pass.
- Price-check alarm: Worker cron emails Kalpit once a day if `checked` > 10.5 h (stops after 8 Nov).

## Governance (details in AGENTS.md, docs/IDEAS.md → Governance; sunset: AGENTS rule 6)
- Goals: (a) friends and family buy well, (c) reach; affiliate is a side effect.
- Adding picks: veto, not approve (`docs/PICKS.md`; validator enforces the limits).
- Score changes move dial handovers: simulate every budget first, tell Kalpit what moves.
- Amazon prices need his screenshot or two dated reports (agents can't read Amazon pages).

## Open asks (waiting on Kalpit)
1. Veto the 13 picks added 11 Oct (reply "remove X"): S26 Ultra, Pixel 11 Pro, Bajaj RX 7, Havells
   Jade, OnePlus Pad Lite, Tab A11+, JBL Flip Essential 2, Sony HT-S100F, Sony WH-CH520, JBL 770NC,
   Mi 20000 power bank, Samsung 7 kg semi-auto and top load, LG 185 L.
2. WhatsApp Channel link ("Kalpit's sale updates") → set `channel` in data.json (button is built).
3. His family link once, in a private chat → `node scripts/fam-hash.mjs` → `FAM_HASH` in index.html.
4. Send Amazon Associates India the question (draft in the round-3 review doc).
5. Older: Nothing (4a) Pro price; `add-bbd-redirect` merge; EarnKaro; `?nostats` on his devices.
6. Unticked in the review (don't build unless he asks): trust/privacy notes, Gmail step move, cut list.

## Known gaps
- Laptops: under ₹40k only the Acer Aspire One 14; no gaming laptop.
- 7 picks added 8 Oct have one source only (Sony WF-1000XM5, Bose QC Earbuds, Sennheiser
  IE 200, Echo Dot 5th Gen, Fire TV Stick 4K Select, Spinnaker Bradner, Cadola Lydden Hill).
- `was` on 60 of 182 picks; gift prices are plain listing prices (bank offers unchecked).
- Amazon links: 95 picks still open a search. Add a `/dp/` link only when an amazon.in
  listing title confirms model and variant; never open amazon.in with tools.
## Next steps for an agent
1. Read `bbd-stats` after a day of counts and tell Kalpit what it says (docs/OPS.md → Traffic).
2. Ideas still open in docs/IDEAS.md: G15 weekly question, R17 later ideas.
