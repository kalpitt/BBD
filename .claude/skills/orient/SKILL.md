---
description: Get oriented on the BBD repo (kalpit.me/BBD festive picks) before doing any work. Use at the start of a session, when resuming, or when the user asks "where are we" / "what's next".
---

# Orient (start of session)

1. `git pull --rebase origin main` so you see Kalpit's phone edits.
2. Read `context/STATE.md` and the last entry of `context/LOG.md`. Compare STATE with
   `git log --oneline -10`. If commits landed that STATE doesn't mention, say so (ignore `Price check:` commits).
3. Health check (GET only; never spend AI questions):
   - First set `ASK=$(grep -o '"askUrl": "[^"]*"' data.json | cut -d'"' -f4)` (the Worker URL)
   - `curl -s -o /dev/null -w "%{http_code}" https://kalpit.me/BBD/` → 200
   - `curl -s https://kalpit.me/BBD/data.json | grep -o '"updated": "[^"]*"'` matches the repo
   - `curl -s "$ASK"` → `{"error":"Send a POST request..."}`
4. `node scripts/check-data.mjs` → ✓
5. Tell Kalpit in 3–5 short lines: what's live, open asks, and anything broken.
