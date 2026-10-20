# STATE: where BBD is right now

_Last updated: 12 Oct 2026, ~8 pm IST. Overwrite at the end of every session; keep it
under 50 lines. Today's review + 5-step build: context/LOG.md (12 Oct entries)._

## Live
- https://kalpit.me/BBD/: 182 picks, 8 tabs. Dial ranks picks (`rankAt()`); slider minimums sit just
  below each tab's cheapest pick. "How I pick" line under the title (Kalpit's words). 🔍 header search.
- Ask box (chat, Workers AI): slim prompt via `planAnswer()`, typed budget = cap, `fixPrices()` bands
  affiliate prices but keeps a non-affiliate pick's own exact price. 10 regression Qs pass (12 Oct).
- Visitor feedback, one set of shared parts in index.html (store buttons, `sendNote`, `nudge` pop-up,
  `findPicks` finder, `goTo`, store-visit event `bbd:back`):
  "Didn't see what you wanted?" box; after a store visit "Did it look right?"; AI 👎 reasons;
  "Do you have an SBI card?" (no-card price); price drops since last visit (never affiliate items);
  empty budget/filter actions. Notes email Kalpit as "BBD question/wish/report/problem".
- Card names come from `sale.bankCard` (bank.name "Bank" = the store's sale card): one line to edit.
- Contact (12 Oct): "Message Kalpit" = Instagram DM button for everyone (taps counted `dm ig`) + email form under "No Instagram?"; no family WhatsApp, no Channel. `mail()` caps 40/day; emails never trigger edits.
- Speed: data.json loads from <head> with a saved-copy fallback; fonts non-blocking; "lite" mode for
  cheap phones. Accessibility: skip link, focus kept on chips, chat read out, 44px small targets.
- Twin code (validator): rankAt, big, nameIndex, cardText, bandRange, budgetFrom (+HINDI_NUM, NOT_MONEY).
- Visit counts: private D1 `bbd-stats` (docs/OPS.md → Traffic has queries for report, left, find, card, fb).

## Price check
- Routine "BBD price check, Sonnet 2 (…every 3h)" wakes session "BBD price checker, Sonnet (2, from
  12 Oct)". Each run in one subagent; stamps `checked` every run; past 500k tokens it starts its own
  successor. Old Routine paused. First run 6:05 pm 12 Oct; this session scheduled a check at ~6:25 pm.
- Worker alarm emails Kalpit once a day if `checked` > 10.5 h (stops after 8 Nov).

## Open asks (waiting on Kalpit), updated 14 Oct
1. REVIVED (Kalpit, 20 Oct): live exact prices on `aff` items with a /dp/ link (9 of 64 now). Code is live; secrets CREATORS_ID/SECRET/MSG_TO
   set as RUNTIME secrets 20 Oct (EU 3.2 token works). Amazon answers 403 AssociateNotEligible (needs 10+ qualifying sales
   in 30 days): GET /prices shows `why` until it flips on by itself. Re-test now and then.
   Needs 10+ qualifying sales in 30 days. More ASINs needed for the other 55 (can't open amazon.in).
2. Optional: price check as a fresh-run routine (web only; projects can't). Kalpit said "later".
3. Sony WH-1000XM6: checker may add it only with a real verified price.
Done 14 Oct: iPhone 17 stays 81,999; Vibe2 13,500; 70 Flipkart picks have `aurl` (EarnKaro); /bbd redirect live;
Gmail filter dropped; 11 Oct picks kept.

## Decisions (12 Oct, don't re-raise)
- Keep all "lowest price / all-time low" claims; Ray-Ban stays on Creator; don't prune phones that never
  lead (they cover edge cases); Book4 prices confirmed; iPhone 16 72,999 from his screenshot.

## Known gaps
- Laptops: under ₹40k only the Acer Aspire One 14; no gaming laptop.
- 95 picks open a store search (no `/dp/` link yet); 55 of 64 affiliate items among them.
- Review findings not built (see LOG 12 Oct): share text "who sent this", ask-box chips 44px,
  Hinglish consistency, 20 cheap phones without `spec`, storage size missing from some phone names.

## Next steps for an agent
1. Check the new price checker's first runs went fine (one subagent, `checked` stamped, phone message,
   new "Instagram" line from `dm ig` taps, skill step 4d).
2. After a day, read `bbd-stats` (report, left, find, card, fb) and tell Kalpit what visitors say.
3. On 9 Nov ask Kalpit: "Sale's over" banner + ask box off, or take the site down (AGENTS rule 6).
