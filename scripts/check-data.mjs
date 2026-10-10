#!/usr/bin/env node
// Validates data.json (and the syntax of the Worker and index.html's scripts) before anything is pushed.
// Pushing to main publishes immediately, so run this first:  node scripts/check-data.mjs
// Exit code 1 = errors (do not push). Warnings are printed but don't block.

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { Script } from "node:vm";

const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);

let d;
try { d = JSON.parse(readFileSync(new URL("../data.json", import.meta.url), "utf8")); }
catch (e) { console.error("✖ data.json is not valid JSON: " + e.message); process.exit(1); }

const isStr = v => typeof v === "string" && v.trim().length > 0;
const isNum = v => typeof v === "number" && Number.isFinite(v);

// ---- top level ----
for (const k of ["updated", "amazonTag", "sale", "categories", "products", "fakeMrp", "faq"]) if (!(k in d)) err(`missing top-level "${k}"`);
if (d.amazonTag !== "bestdeallive-21") err(`amazonTag must be "bestdeallive-21" (got ${JSON.stringify(d.amazonTag)})`);
if (d.askUrl && !/^https:\/\//.test(d.askUrl)) err("askUrl must start with https://");
if (!d.sale || !isStr(d.sale.amazon) || !isStr(d.sale.flipkart) || !Array.isArray(d.sale.cards) || !d.sale.cards.every(isStr)) err("sale needs amazon, flipkart (text) and cards (list of text)");
if (!Array.isArray(d.faq) || !d.faq.every(f => Array.isArray(f) && f.length === 2 && f.every(isStr))) err("faq must be a list of [question, answer] pairs");
for (const [i, f] of (d.fakeMrp || []).entries()) if (!isStr(f.n) || !isNum(f.mrp) || !isNum(f.p) || !(f.mrp > f.p && f.p > 0)) err(`fakeMrp[${i}] needs n, mrp > p > 0`);

// ---- categories ----
const cats = new Map();
const checkDial = (c, where) => {
  if (!isStr(c.noun)) err(`${where}: missing noun`);
  if (![c.min, c.max, c.step, c.def].every(isNum)) return err(`${where}: min, max, step, def must be numbers`);
  if (!(c.min < c.def && c.def < c.max)) err(`${where}: needs min < def < max`);
  if (c.step <= 0) err(`${where}: step must be > 0`);
};
for (const c of d.categories || []) {
  if (!isStr(c.id) || !isStr(c.label)) { err("category missing id/label"); continue; }
  if (cats.has(c.id)) err(`duplicate category id ${c.id}`);
  cats.set(c.id, c);
  if (c.types) for (const t of c.types) checkDial(t, `category ${c.id} / type ${t.id}`);
  else checkDial(c, `category ${c.id}`);
}

// ---- products ----
const ids = new Set(), names = new Set(), used = new Set();
for (const [i, x] of (d.products || []).entries()) {
  const at = `product ${x.id || "#" + i}`;
  if (!isStr(x.id) || !/^[a-z0-9-]+$/.test(x.id)) err(`${at}: id must be lowercase letters, digits, dashes`);
  if (ids.has(x.id)) err(`${at}: duplicate id`); ids.add(x.id);
  if (!isStr(x.n)) err(`${at}: missing name (n)`);
  if (names.has(x.n)) err(`${at}: duplicate name "${x.n}" (the ask box looks products up by name)`); names.add(x.n);
  if (!isNum(x.p) || x.p <= 0 || !Number.isInteger(x.p)) err(`${at}: price p must be a positive whole number`);
  if (x.max != null && !(isNum(x.max) && x.max > x.p)) err(`${at}: max must be greater than p`);
  if (!["Flipkart", "Amazon", "Both"].includes(x.s)) err(`${at}: s must be Flipkart, Amazon or Both`);
  if (x.aff && x.s === "Flipkart") err(`${at}: aff:true only works for Amazon or Both`);
  if (!isStr(x.why)) err(`${at}: missing why`);
  if (!isNum(x.score) || x.score < 1 || x.score > 10) err(`${at}: score must be 1–10`);
  if (x.card != null && typeof x.card !== "string") err(`${at}: card must be text`);
  // Discount layers: was (normal price) -> list (sale price) - coupon - bank.off = p
  for (const k of ["was", "list", "coupon"]) if (x[k] != null && !(isNum(x[k]) && Number.isInteger(x[k]) && x[k] > 0)) err(`${at}: ${k} must be a positive whole number`);
  if (x.bank != null && !(x.bank && isStr(x.bank.name) && isNum(x.bank.off) && Number.isInteger(x.bank.off) && x.bank.off > 0)) err(`${at}: bank must be {"name": "SBI", "off": 2000}`);
  if (x.bank && /\d/.test(x.bank.name)) err(`${at}: bank.name is the card name only (e.g. "SBI"), no amounts`);
  if (x.list != null && isNum(x.p)) {
    const want = x.list - (x.coupon || 0) - (x.bank ? x.bank.off : 0);
    if (x.p !== want) err(`${at}: p must equal list - coupon - bank.off (${x.list} - ${x.coupon || 0} - ${x.bank ? x.bank.off : 0} = ${want}), got ${x.p}`);
  } else if (x.coupon != null) err(`${at}: coupon needs list (the sale price before the coupon)`);
  if (x.was != null && isNum(x.p) && !(x.was > (x.list || x.p))) err(`${at}: was (normal price) must be higher than the sale price`);
  if ((x.list != null || x.bank != null || x.was != null) && x.est) warn(`${at}: discount layers on an estimate. Remove them or firm up the price`);
  if (x.auto != null && x.auto !== true) err(`${at}: auto must be true or left out`);
  if (x.faq && !(Array.isArray(x.faq) && x.faq.every(f => Array.isArray(f) && f.length === 2 && f.every(isStr)))) err(`${at}: faq must be [question, answer] pairs`);

  const c = cats.get(x.cat);
  if (!c) { err(`${at}: unknown cat "${x.cat}"`); continue; }
  let dial = c;
  if (c.types) {
    dial = c.types.find(t => t.id === x.type);
    if (!dial) { err(`${at}: category ${c.id} needs a type from: ${c.types.map(t => t.id).join(", ")}`); continue; }
  } else if (x.type) err(`${at}: category ${c.id} has no types; remove "type"`);
  used.add(c.id + "/" + (x.type || ""));

  const uses = (c.uses || []).map(u => u.id);
  for (const t of x.tags || []) if (!uses.includes(t)) err(`${at}: tag "${t}" isn't one of ${c.id}'s uses (${uses.join(", ") || "none"})`);

  if (x.url) {
    if (x.aff) err(`${at}: aff:true with a url drops the affiliate tag. Remove url (search link with tag is used)`);
    if (x.s === "Both") err(`${at}: url is ignored when s is Both. Remove it`);
    const host = (() => { try { return new URL(x.url).hostname; } catch { return ""; } })();
    if (x.s === "Flipkart" && !host.endsWith("flipkart.com")) err(`${at}: url must be a flipkart.com link`);
    if (x.s === "Amazon" && !host.endsWith("amazon.in")) err(`${at}: url must be an amazon.in link`);
  }

  if (isNum(dial.min) && (x.p < dial.min || x.p > dial.max)) warn(`${at}: price ${x.p} is outside the ${c.id}${x.type ? "/" + x.type : ""} slider (${dial.min}–${dial.max}), so it can never be shown`);
  if (x.aff) for (const txt of [x.why, x.card, ...(x.faq || []).flat()]) if (/₹\s*\d/.test(txt || "")) warn(`${at}: affiliate item mentions a ₹ amount ("${txt}"). Amazon policy: keep exact prices off affiliate items`);
}
for (const c of cats.values()) {
  const keys = c.types ? c.types.map(t => c.id + "/" + t.id) : [c.id + "/"];
  for (const k of keys) if (!used.has(k)) warn(`${k.replace(/\/$/, "")} has no products, so its tab will be empty`);
}

// ---- did products change without bumping "updated"? ----
try {
  const prev = JSON.parse(execSync("git show HEAD:data.json", { cwd: new URL("..", import.meta.url), stdio: ["ignore", "pipe", "ignore"] }).toString());
  if (JSON.stringify(prev.products) !== JSON.stringify(d.products) && prev.updated === d.updated) warn(`products changed but "updated" is still "${d.updated}". Bump it so friends see it's fresh`);
} catch { /* no git history available; skip */ }

// ---- Worker syntax ----
try { execSync("node --input-type=module --check < worker/worker.js", { cwd: new URL("..", import.meta.url), stdio: "pipe", shell: "/bin/sh" }); }
catch (e) { err("worker/worker.js has a syntax error: " + String(e.stderr || e.message).split("\n").slice(0, 3).join(" ")); }

// ---- index.html scripts: syntax only (a typo there blanks the page for everyone) ----
try {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const blocks = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g)];
  for (const [i, m] of blocks.entries()) {
    try { new Script(m[1], { filename: `index.html script ${i + 1}` }); }
    catch (e) { err(`index.html script ${i + 1} has a syntax error: ${e.message}`); }
  }
} catch (e) { err("couldn't read index.html: " + e.message); }

// ---- picks agents added that Kalpit hasn't looked at yet (AGENTS.md → Adding picks) ----
const auto = (d.products || []).filter(x => x.auto).map(x => x.n);
if (auto.length) console.log(`ℹ Added by agents, waiting for Kalpit's "keep" or "remove": ${auto.join(", ")}`);

for (const w of warns) console.log("⚠ " + w);
for (const e of errors) console.log("✖ " + e);
console.log(errors.length ? `\n✖ ${errors.length} error(s). Do not push.` : `\n✓ data.json OK (${d.products.length} products${warns.length ? ", " + warns.length + " warning(s)" : ""}).`);
process.exit(errors.length ? 1 : 0);
