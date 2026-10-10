@AGENTS.md

# CLAUDE.md

`AGENTS.md` (imported above) is the single source of truth. Keep real guidance there.

Claude Code extras:
- Skills in `.claude/skills/`: `/orient` (start), `/update-picks` (price or pick
  changes), `/handoff` (end),
  `/price-check` (run every 3 hours by a Routine during the sale; on Sonnet since 10 Oct,
  see AGENTS.md → "Why things are the way they are").
- Save tokens (Kalpit's ask, 8 Oct): hand routine work to cheaper subagents via the Agent
  tool's `model`: `haiku` for simple lookups and checks (one price, one page, live-site
  checks); `sonnet` for multi-step research (price-history hunts, sale reports). Keep
  code changes, rule calls (price honesty, privacy) and final checks in the main session.
- `gh` may be available for checking deploys; see `docs/OPS.md`.
- Kalpit's global rules may say "never push to main". **This repo is the deliberate
  exception: commit straight to `main`** (see AGENTS.md).
