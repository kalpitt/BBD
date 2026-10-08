---
description: End-of-session ritual for the BBD repo. Update the living memory so the next chat starts current. Use before stopping, when context runs low, or when the user says "wrap up" / "write a handoff".
---

# Handoff (end of session)

The repo is public: write no names, numbers, chat content or personal plans.

1. Overwrite `context/STATE.md`: what's live, open asks, known gaps, and the next
   1–3 steps. Update the date at the top.
2. Append one entry to the bottom of `context/LOG.md` (template at its top). Note
   decisions and gotchas, not just tasks.
3. `git pull --rebase origin main`, then `node scripts/check-data.mjs`, then commit
   (`handoff: YYYY-MM-DD <topic>`) and `git push origin main`.
4. Make sure nothing is left uncommitted or unpushed (`git status -sb`).
