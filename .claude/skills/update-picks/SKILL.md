---
description: Change prices, add/remove picks, or edit verdicts and quick answers on kalpit.me/BBD. Use whenever Kalpit says things like "S25 is now 55,999", "add X", "remove Y", "change the verdict for Z".
---

# Update picks

1. `git pull --rebase origin main`.
2. Edit `data.json` only (field guide: `docs/DATA.md`). Keep the rules in mind:
   - `aff: true` items never get exact ₹ amounts in `why`, `card` or `faq`.
   - Don't invent prices. If Kalpit's message is ambiguous (which variant? card price
     or not?), ask one short question first.
   - "keep X" / "keep all": delete `"auto": true` from those picks (agent-added picks
     he has now approved). "remove X": delete the pick.
   - Bump `updated` to the current IST time, e.g. `"9 Oct, 2:15 pm"`.
3. `node scripts/check-data.mjs` must print ✓. Read the warnings and fix any that matter.
4. Optional for layout changes: preview with `python3 -m http.server 8765`.
5. Commit straight to main with a plain message, e.g. `Prices: S25 55,999, Pixel 10a 38,999`,
   then `git push origin main`.
6. About a minute later, verify the live `data.json` shows the new `updated` stamp
   (`docs/OPS.md` → Verify).
7. Reply to Kalpit with what changed, in one or two lines. The ask box picks up the
   new prices within about 5 minutes (bumping `updated` retires cached answers).
