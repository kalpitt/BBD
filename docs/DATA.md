# Editing `data.json`

Everything on the page comes from `data.json`, and the ask box reads it live. After any
edit, run `node scripts/check-data.mjs`, then commit and push to `main`. It's live in
about a minute.

## Product fields
| Field | Required | Meaning |
|---|---|---|
| `id` | ✓ | Unique, lowercase letters, digits and dashes (e.g. `s25`, `wm-bosch8`) |
| `cat` | ✓ | `phones`, `tv`, `laptops`, `home`, `audio`, `fitness` or `gadgets` |
| `type` | home, audio, gadgets | home: `washing`, `fridge`, `ac`, `microwave`, `chimney`, `dishwasher`, `vacuum`, `purifier`, `geyser`; audio: `earbuds`, `headphones`, `chargers`; gadgets: `watches`, `creator`, `desk`, `hometech` |
| `n` | ✓ | Name shown on the page. Must be unique (the ask box matches by name) |
| `p` | ✓ | Price in rupees, whole number: the sale price **including** the sale's normal card offer (Flipkart Axis/ICICI, Amazon SBI). Not the extra 5% co-branded card offer |
| `max` | | Top of a price range. With `est: true`, non-affiliate items show "₹X–Y" |
| `est` | | `true` = estimate, shown as "Expected" |
| `from` | | `true` = shows "From ₹X" |
| `s` | ✓ | `Flipkart`, `Amazon` or `Both` |
| `aff` | | `true` = Amazon affiliate link. The page shows a **band** (e.g. ₹15,000–20,000), never the exact price. Only for items earning about ₹250+ per sale (see "Which Amazon items are affiliate"); leave it out otherwise for a plain link with the exact price |
| `card` | | Offer note in green, e.g. `"Includes bank offer"`. Don't put the extra 5% co-branded card price here: the page adds that line itself from `sale.extra`. No ₹ amounts if `aff` |
| `noExtra` | | `true` = hide the page-wide 5% co-branded card line for this pick (when `card` already names its own card cashback) |
| `why` | ✓ | One-line verdict in Kalpit's voice. No ₹ amounts if `aff` |
| `tags` | | Phones only: `parents`, `basic`, `battery`, `camera`, `gaming`, `iphone` |
| `score` | ✓ | 1–10. Higher wins when picks fit the same budget |
| `faq` | | `[["Question?", "Answer."]]`, shown under the top pick |
| `was` | | Normal price before the sale (what it usually sells for, **not** MRP). Used for the "Big deal" check. Source: pricebefore.com history, **lowest price 1–20 Sep** (skips pre-sale price hikes), from the closest listing of the same model and store (Kalpit, 8 Oct: trust the tracker even when its sale-day price differs from our `p`, e.g. because `p` includes a card offer). Skip listings that sat at MRP |
| `list` | | Sale price shown on the listing, before coupon and card offer. When set, `p` must equal `list − coupon − bank.off` (the validator checks) |
| `coupon` | | Coupon amount in ₹ (mostly Amazon). Needs `list` |
| `bank` | | Sale card instant discount: `{"name": "SBI", "off": 2000}`. Use `"name": "Bank"` if the card isn't known. Card name only, no amounts in `name` |
| `auto` | | `true` = an agent added this pick and Kalpit hasn't said "keep" yet (AGENTS.md → Adding picks). Not shown on the page. Delete it when he approves |
| `url` | | Direct product link. Not allowed with `aff` (it would drop the affiliate tag) or with `s: "Both"` |

### Discount layers and "Big deal"
`was → list → coupon → bank` explain how `p` is reached. All optional; `p` stays the
final price, so the slider and ranking use it as before. The co-branded 5% (`sale.extra`)
is **not** a layer: it's an alternative card, not stacked on the bank offer.
- The page shows a **"How you get this price"** breakdown. Non-affiliate items show
  exact ₹; `aff: true` items show labels only ("SBI card offer", "Coupon on the product
  page"), because Amazon doesn't allow hand-typed prices on affiliate items.
- **Big deal** (automatic, no field to set): card offer above 12% of the price before it
  (`bank.off > 0.12 × (p + bank.off)`), or `p` at least 25% below `was`. Big deals get a
  🔥 badge, a "Big deals" chip in their tab, a small ranking boost, and a "BIG DEAL" note
  for the Ask box. Rule lives in `big()` in both `index.html` and `worker/worker.js`.

```json
{"id": "rayban", ..., "p": 15425, "list": 22425, "bank": {"name": "SBI", "off": 7000}, "aff": true, ...}
```

Other top-level keys: `updated` (shown in the footer; **change it on every
edit**, in IST and exactly this shape, e.g. `"9 Oct, 2:15 pm"`), `checked` (same shape; the
last time the price checker compared prices, even with no changes. The page shows it as
"Prices checked 12 min ago", falling back to `updated` if `checked` is missing), `askUrl` (Ask box address), `amazonTag` (don't change), `sale` (dates, `extra` = the year-round 5% co-branded card line per store, and card
offers), `categories` (slider ranges), `fakeMrp` (the "ignore the % off" table), `removed` (names Kalpit took off; agents must not re-add them, the validator checks) and
`faq` (quick answers).

## Which Amazon items are affiliate
Kalpit, 10 Oct: show exact prices on most items; keep the affiliate band only where the
commission is worth it. Rule: `p × rate ≥ about ₹250` → `aff: true`; otherwise no `aff`.
Rates from the official Amazon Associates India fee schedule (Oct–Nov 2026,
affiliate-program.amazon.in/help/node/topic/GRXPHT8U84RAYDXZ); re-check if it changes.

| Rate | Categories |
|---|---|
| 0% | Apple products, all microwaves, semi-automatic washing machines, audio under ₹3,000 MRP, earbuds/headsets from OnePlus, realme, Xiaomi, iQOO, Vivo, pTron, Portronics and others |
| 0–2% | Mobile phones (most 0%) |
| 2.45% | Computers, tablets, TVs, large appliances (fridge, AC, washing machine, dishwasher, chimney) |
| 2.63–2.8% | Camera, electronics (headphones, speakers, wearables) |
| 3.4% | Wireless accessories (chargers, power banks) |
| 4–4.25% | Home, kitchen, furniture, office |
| 4.72% | Sports & fitness, personal care appliances |
| 7.5% | Watches, bags, luggage, clothing |

Rough break-even for 250: about ₹10,200 at 2.45%, ₹8,900 at 2.8%, ₹5,900 at 4.25%,
₹3,300 at 7.5%. When unsure of the category, use the lower rate.

## Worked examples

**Change a price.** Find the product by `n`, edit `p` (and `card` if it names a price),
then bump `updated`.
```json
{"id": "s25", ..., "p": 55999, "card": "Includes bank offer", ...}
```

**Add a phone:**
```json
{"id": "pixel10", "cat": "phones", "n": "Google Pixel 10", "p": 52999, "s": "Flipkart",
 "card": "Includes bank offer", "why": "Pixel camera with a bigger battery.",
 "tags": ["camera"], "score": 7}
```

**Add an Amazon affiliate appliance.** Set `aff: true` and leave out `url`:
```json
{"id": "wm-ifb7", "cat": "home", "type": "washing", "n": "IFB 7 kg front load",
 "p": 24990, "aff": true, "s": "Amazon", "card": "After bank and coupon offer",
 "why": "Trusted front loader for small families.", "tags": [], "score": 6}
```

**Remove a pick** (out of stock or bad deal): delete its whole `{...}` entry. Keep the
commas valid; the validator will catch a broken file.

**Price outside the slider range:** the validator warns you. Widen the category's
`min`/`max`, or the product will never appear.
