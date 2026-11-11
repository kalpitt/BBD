# STATE: where BBD is right now

_Last updated: 12 Nov 2026, ~9 am IST. Overwrite at the end of every session; keep it under 50 lines._

## The sale is over; the site stays up as a project (Kalpit, 12 Nov)
- https://kalpit.me/BBD/ stays live. `data.json` has `sale.over: true`, which makes `index.html`:
  show an amber banner ("The festive sale is over… prices last checked <updated>… Message me"),
  switch the AI chat off (floating button and teaser open the contact card instead), and hide the
  "Didn't see what you wanted?" box. Contact stays: "DM Kalpit on Instagram" + email form.
- To bring the AI chat back, remove `"over": true` from `data.json`'s `sale` block (the Worker is
  still deployed; nothing else changed there). `scripts/smoke.mjs` follows `sale.over`.
- Prices are FROZEN since the final refresh on 12 Nov, 3:25 am (commit e42dd7e, 12 Flipkart changes).
  Not refreshed because Flipkart pages show no readable card-offer amount: iPhones, Vivo X200T,
  Moto G37 Power, Eureka, Philips purifiers, geysers, Samsung TVs, Sony 65", MacBook M5, monitors,
  audio, LG fridge. Amazon prices were never refreshed (Amazon is off-limits to tools).
- Kalpit asked to stop the 3-hourly price check: the Routine "BBD price check, Sonnet 5 (…every 3h)"
  is DISABLED (12 Nov). Earlier Routines are paused. Do not re-enable without Kalpit.
- The Worker's daily "price check is late" alarm email stopped after 8 Nov; no price check runs now.

## Still open (waiting on Kalpit, unchanged)
- Xiaomi F43 TV link (id tv-xiaomi-f43) looks cut off; Nothing Phone (4b), Galaxy F70e, Philips AC1711
  and Samsung 65" Neo QLED prices vs live listings; HMD Vibe2 5G link opens the 64 GB variant.
- Sale-over decision (rule 6): chosen = banner + AI chat off + site stays up. Take-down not chosen.

## Reminders
- Pushing to `main` publishes (Pages + Worker build). Run `node scripts/check-data.mjs` (✓) and, for
  index.html changes, `node scripts/smoke.mjs` (✓) first.
- Repo is PUBLIC: no names, numbers or chat text. Never open amazon.in with tools.
- Older history: context/LOG.md.
