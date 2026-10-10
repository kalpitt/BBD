#!/usr/bin/env node
// Turns Kalpit's private family link into FAM_HASH for index.html, so the page accepts only
// that link's code and ignores any other ?f= number (someone could otherwise send his family
// a kalpit.me link that sets their own number as "Kalpit's WhatsApp").
//   node scripts/fam-hash.mjs "https://kalpit.me/BBD/?f=<code>"
// Paste the printed hash into FAM_HASH in index.html. Never write the link or code in the repo.
// Same settings as famHash() in index.html.
import { webcrypto as crypto } from "node:crypto";

const arg = process.argv[2] || "";
let code = arg;
try { code = new URL(arg).searchParams.get("f") || ""; } catch { /* a bare code */ }
if (!/^[0-9a-z]+$/i.test(code)) { console.log('Usage: node scripts/fam-hash.mjs "https://kalpit.me/BBD/?f=<code>"'); process.exit(1); }
const n = String(parseInt([...code].reverse().join(""), 36));
if (!/^\d{11,13}$/.test(n)) { console.log("✖ That code doesn't hold a phone number. Check the link."); process.exit(1); }
const te = new TextEncoder();
const k = await crypto.subtle.importKey("raw", te.encode(code), "PBKDF2", false, ["deriveBits"]);
const b = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: te.encode("kalpit.me/BBD family"), iterations: 300000, hash: "SHA-256" }, k, 256);
console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""));
