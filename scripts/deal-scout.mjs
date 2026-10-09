#!/usr/bin/env node
// Deal scout: reads public deal channels, keeps electronics/appliance deals from the last
// few hours and prints a short list for the price-check agent to judge.
//   node scripts/deal-scout.mjs            (last 3.5 hours)
//   node scripts/deal-scout.mjs --hours 6
// Read-only: it never edits data.json. Links point to the deal post, never to the
// poster's own (affiliate) shop link.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// Public Telegram channels: t.me/s/<handle> shows recent posts without logging in.
// Add a handle only after checking its t.me/s page lists posts (see docs/OPS.md).
const CHANNELS = ["desidime", "dealsheaven"];

const hoursArg = process.argv.indexOf("--hours");
const HOURS = hoursArg > 0 ? Number(process.argv[hoursArg + 1]) : 3.5;
const since = Date.now() - HOURS * 3600e3;
const UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36";

// curl, not fetch: curl follows the container's HTTPS proxy settings. One retry: t.me
// sometimes stalls.
const curl = url => execFileSync("curl", ["-sfL", "--max-time", "25", "-A", UA, url], { encoding: "utf8", maxBuffer: 20e6 });
const get = url => { try { return curl(url); } catch { return curl(url); } };

const decode = s => s
  .replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n))
  .replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();

function readChannel(handle) {
  const posts = [];
  let before = "";
  for (let page = 0; page < 6; page++) {
    const html = get(`https://t.me/s/${handle}${before}`);
    const chunks = html.split('data-post="').slice(1);
    if (!chunks.length && !page) throw new Error("no public posts");
    if (!chunks.length) break;
    let oldest = Infinity, minId = Infinity;
    for (const c of chunks) {
      const id = Number(c.slice(0, c.indexOf('"')).split("/")[1]);
      const text = (c.match(/tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/) || [])[1];
      const time = Date.parse((c.match(/<time datetime="([^"]+)"/) || [])[1]);
      minId = Math.min(minId, id);
      if (!Number.isFinite(time)) continue;
      oldest = Math.min(oldest, time);
      if (text && time >= since) posts.push({ src: handle, link: `t.me/${handle}/${id}`, time, text: decode(text) });
    }
    if (oldest < since || !Number.isFinite(minId)) break;
    before = `?before=${minId}`;
  }
  return posts;
}

// First match wins. [pattern, category, type]. type null = a kind the site doesn't list yet.
// Matched against the post's title (the part before the price) so feature lists like
// "30W box speakers" on a TV don't decide the category.
const RULES = [
  [/fire ?tv stick|streaming stick|chromecast/, "gadgets", "hometech"],
  [/laptop|macbook|notebook|chromebook/, "laptops", ""],
  [/treadmill|walking ?pad|exercise bike|massage gun|massager/, "fitness", ""],
  [/tablet|ipad|\btab\b|\bpad\b|kindle/, "gadgets", "hometech"],
  [/all[- ]in[- ]one pc|desktop pc|mini pc|printer|projector|trimmer|shaver|hair dryer|playstation|\bps5\b|xbox|nintendo|console|e-?bike|electric scooter/, "new", null],
  [/monitor|keyboard|mouse|\bssd\b|hard (disk|drive)|pen ?drive|desk/, "gadgets", "desk"],
  [/smart ?tv|led tv|google tv|fire tv|television|\d\d ?(inch|")[^,]{0,40}\b(4k|uhd|qled|oled)\b/, "tv", ""],
  [/headphones?|speaker|soundbar|home theat(re|er)|party ?(box|pal)/, "audio", "headphones"],
  [/earbuds|\btws\b|earphones?|neckband|airpods|\bbuds\b/, "audio", "earbuds"],
  [/power ?bank|charger|\bgan\b/, "audio", "chargers"],
  [/camera|gopro|action cam|dash ?cam|gimbal|microphone|\bmic\b|webcam/, "gadgets", "creator"],
  [/smart ?watch|fitness band|smart band|smart ring|\bwatch\b/, "gadgets", "watches"],
  [/\btv\b|qled|oled|mini ?led/, "tv", ""],
  [/refrigerator|fridge/, "home", "fridge"],
  [/washing machine|washer dryer/, "home", "washing"],
  [/air conditioner|\bac\b|split ac|window ac/, "home", "ac"],
  [/microwave|\botg\b/, "home", "microwave"],
  [/chimney/, "home", "chimney"],
  [/dishwasher/, "home", "dishwasher"],
  [/air purifier|water purifier|vacuum|robot (vacuum|cleaner)|air fryer|geyser|water heater|mixer grinder|cooler|ceiling fan|bldc/, "home", null],
  [/echo|alexa|smart plug|smart bulb|router|mesh wi-?fi/, "gadgets", "hometech"],
  [/iphone|smartphone|\bmobile\b|(?<![\d.])5g\b|galaxy|redmi|poco|pixel|oneplus|nothing phone|cmf phone|iqoo|vivo|oppo|realme|motorola|\bmoto\b|tecno|infinix|\blava\b|narzo|honor/, "phones", ""],
];
// Not for this site: fashion, beauty, grocery, kids, small household items, coupons, and
// round-up posts that bundle many unrelated deals.
const SKIP = /shirt|t-?shirt|jeans|trouser|kurta|saree|dress|shoes?\b|sandal|slipper|sneaker|\bbra\b|lingerie|socks|handbag|wallet|perfume|deo(dorant)?\b|shampoo|lipstick|cream|face ?wash|serum|diaper|atta|\brice\b|\boil\b|ghee|dry ?fruit|almond|anjeer|cashew|recharge|gift card|voucher|cashback|\bkids?\b|\btoy|bottle|casserole|lunch ?box|bedsheet|curtain|luggage|trolley|backpack|\bcover\b|\bcase\b|screen ?guard|tempered|\bcable\b|strap|freshener|hot threads|top \d+ deals/;
const titleOf = t => {
  const head = t.split(/💰|₹|\brs\.? ?\d|read more|buy now|🛍/i)[0];
  return head.length >= 20 ? head : t;
};

const price = t => {
  const m = t.match(/(?:₹|rs\.?|inr|@|💰|\bat(?= ?\d))\s?(?:deal\s?)?(\d[\d,]*)/i);
  return m ? Number(m[1].replace(/,/g, "")) : null;
};
const STORE = /amazon|flipkart|croma|reliance digital|vijay sales|tata cliq|jiomart|zepto|blinkit|myntra|ajio/i;
const off = t => (t.match(/(\d{2})\s?%\s?off/i) || [])[1];

// Picks already on the site, to tell new deals from price news about current picks.
const data = JSON.parse(readFileSync(new URL("../data.json", import.meta.url), "utf8"));
const tok = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
const OPTIONAL = new Set(["apple", "samsung", "google", "5g"]);
const picks = data.products.map(p => ({ id: p.id, words: tok(p.n).filter(w => !OPTIONAL.has(w)) })).filter(p => p.words.length >= 2)
  .sort((a, b) => b.words.length - a.words.length);
const onSite = title => {
  const words = new Set(tok(title));
  return picks.find(p => p.words.every(w => words.has(w)))?.id;
};

const failed = [], all = [];
for (const h of CHANNELS) {
  try { all.push(...readChannel(h)); } catch (e) { failed.push(`${h} (${e.message.split("\n")[0].slice(0, 80)})`); }
}

const seen = new Set(), fresh = [], known = [];
let dropped = 0;
for (const p of all.sort((a, b) => b.time - a.time)) {
  const lower = p.text.toLowerCase();
  const rule = RULES.find(([re]) => re.test(titleOf(lower)));
  const rs = price(p.text);
  const key = tok(p.text).slice(0, 6).join(" ");
  // No price = a category-wide sale, not a product we could list.
  if (!rule || SKIP.test(lower) || rs === null || rs < 1000 || seen.has(key)) { dropped++; continue; }
  seen.add(key);
  const [, cat, type] = rule;
  const label = cat === "new" ? "new category?" : type === null ? `${cat}: new type?` : type ? `${cat}/${type}` : cat;
  const pick = onSite(titleOf(p.text));
  const when = new Date(p.time).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });
  const line = `- [${pick ? `${label} → maybe on site: ${pick}` : label}] ${p.text.slice(0, 150)}` +
    ` | ₹${rs.toLocaleString("en-IN")}${off(p.text) ? `, ${off(p.text)}% off` : ""} | ${(p.text.match(STORE) || ["store?"])[0]} | ${p.src} ${when} | ${p.link}`;
  (pick ? known : fresh).push(line);
}

console.log(`Deal scout: ${all.length} posts in the last ${HOURS}h from ${CHANNELS.length - failed.length} channels; kept ${fresh.length + known.length}, dropped ${dropped}.`);
if (failed.length) console.log(`Couldn't read: ${failed.join(", ")}`);
console.log(`\nNOT ON SITE (${fresh.length}):`);
console.log(fresh.join("\n") || "- none");
console.log(`\nCURRENT PICKS MENTIONED (${known.length}):`);
console.log(known.join("\n") || "- none");
