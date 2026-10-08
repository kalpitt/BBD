---
description: Scheduled price check for kalpit.me/BBD during the sale. Compares data.json prices with live Amazon/Flipkart prices and pushes only confirmed changes. Runs every 3 hours from a Routine; can also be run by hand ("check prices").
---

# Price check (scheduled agent)

You run unattended. Nobody answers questions mid-run. Your final message is sent
as a notification to Kalpit's phone, so keep it short and plain.

## 0. Stop conditions
- Today is after **20 Oct 2026** → change nothing. Final message: "Sale's over. Delete
  the BBD price-check Routine and decide on the sunset banner (AGENTS.md rule 6)."
- `node scripts/check-data.mjs` fails before you touch anything → change nothing,
  report it.

## 1. Setup
1. `git fetch origin main && git checkout main && git pull --rebase origin main`.
   You work on `main` (AGENTS.md). If you can't push to main, still make the edits on
   your branch and say clearly: "NOT live until it's on main".
2. Read `data.json` and the rules in `AGENTS.md` (price honesty, Kalpit's standing calls).

## 2. Check prices (cheapest first)
Priority order, one pass per run. Skip items you checked with no change in the last
run only if you're short on time; otherwise check everything.
1. Phones (`cat: "phones"`), highest `score` first.
2. Items with `est: true` (try to firm them up).
3. Everything else.

Sources, best first:
- **Listing page**: the item's `url` (Flipkart) or an Amazon search for `n`. Use the
  exact model and the variant that matches the current price (usually the base
  storage). If the host is blocked or shows a captcha, move on.
- **Dated 2026 sale reports** (WebSearch): only articles dated 8 Oct 2026 or later
  that quote the live sale price. Ignore 2023–2025 articles and pre-sale "expected"
  prices.

`p` is the price **including** the sale's normal card offer (Flipkart: Axis/ICICI;
Amazon: SBI, sometimes HDFC) and coupons. Do **not** subtract the extra 5% from
co-branded cards (Flipkart Axis/SBI, Amazon Pay ICICI): the page shows that as its own
line from `sale.extra`. A listing shows the price before the card offer; subtract only
the normal card discount shown on that same listing.

**Discount layers** (`list`, `coupon`, `bank`, `was`; see `docs/DATA.md`): on items
that have them, also check the listing's sale price, coupon and card offer. If any
changes, update the layer **and** `p` together so `p = list − coupon − bank.off`.
Note in the report when a card offer becomes unusually big (above ~12%) or disappears.
Don't add layers to items that don't have them unless the listing shows all of them.

## 3. Is it confirmed?
Change `p` only when ALL of these hold:
- Seen on the listing page itself, **or** two independent dated sale reports agree
  on the same effective price.
- Same model and variant as the pick.
- Difference is at least ₹500, or the item has `est: true` and the price now is real.
- For `aff: true` items, only change `p` if the page's band would change (see
  `band()` in `index.html`). Otherwise leave it.

Anything else (one report only, unclear variant, card offer unclear, out of stock,
price outside the category slider range) → **don't edit, put it in the report**.
Never remove a pick, never add one, never change `score` or verdicts on your own,
except to fix a `why`/`card` sentence whose ₹ amount the new price makes wrong.

Confirmed price for an `est: true` item → set `p`, delete `est` and `max`.

**Safety brake:** more than 8 confirmed changes in one run is suspicious. Apply none,
list them in the report for Kalpit.

## 3b. Always: stamp the check time
If you compared at least a few prices this run (even with no changes), set `checked` in
`data.json` to the current IST time, e.g. `"9 Oct, 3:05 pm"` (same shape as `updated`).
The page shows it as "Prices checked 12 min ago". Don't bump it if every source was
blocked. If nothing else changed, commit just that line as `Price check: no changes`,
then `git pull --rebase origin main && git push origin main`. Don't bump `updated`
for a no-change run (it retires the Ask box's cached answers).

## 4. Apply (only if there are confirmed changes)
1. Edit `data.json` by text replacement, one product per line (no `json.dump`).
2. `aff: true` items: no exact ₹ amounts in `why`, `card` or `faq`.
3. Fix any `card` or `why` text that names the old price, or a gap that's now wrong
   (e.g. "₹50k less").
4. Bump `updated` to the current IST time, e.g. `"9 Oct, 3:00 pm"`.
5. `node scripts/check-data.mjs` must print ✓. On ✖: fix it or discard your edits.
   Never push on ✖.
6. Commit: `Price check: S25 57,999 (was 59,999), Edge 70 firmed at 31,999`.
7. `git pull --rebase origin main && git push origin main`.
8. Append one short entry to `context/LOG.md` only if prices changed (same commit).
9. Verify per `docs/OPS.md` → Verify, if the hosts are reachable. If the live site
   breaks, `git revert <sha> && git push origin main` first.

Never spend ask-box questions. Never write friends' names or anything private.

## 5. Final message (max ~8 lines)
```
Price check, 9 Oct 3 pm
Changed (live): S25 ₹59,999 → ₹57,999 (Flipkart listing)
Needs you: Edge 70 one report says ₹31,999, not confirmed
Couldn't check: Amazon blocked / captcha
```
If nothing changed and nothing needs Kalpit, say exactly: "Price check: no changes."
