#!/usr/bin/env node
// Smoke test: opens the page in a headless browser, visits every tab and checks a pick
// shows with no script errors. Run before pushing a change to index.html or worker/worker.js:
//   node scripts/smoke.mjs
// Needs Playwright + Chromium (preinstalled in Claude cloud sessions). Exit 1 = don't push.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { extname, join, normalize } from "node:path";

const root = new URL("..", import.meta.url).pathname;

let chromium;
try { ({ chromium } = await import("playwright")); }
catch {
  try { ({ chromium } = createRequire(join(execSync("npm root -g").toString().trim(), "x"))("playwright")); }
  catch { console.log("✖ Playwright isn't installed here. Preview by hand instead (docs/OPS.md → Preview)."); process.exit(1); }
}

// Serve the repo like GitHub Pages does.
const types = { ".html": "text/html", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".js": "text/javascript" };
const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  try { const body = await readFile(join(root, path)); res.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" }).end(body); }
  catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}/`;

const data = JSON.parse(await readFile(join(root, "data.json"), "utf8"));
const views = data.categories.flatMap(c => c.types ? c.types.map(t => `${c.id}-${t.id}`) : [c.id]);

const problems = [];
const opts = process.env.PLAYWRIGHT_BROWSERS_PATH ? {} : { executablePath: "/opt/pw-browsers/chromium" };
const browser = await chromium.launch(opts).catch(() => chromium.launch());
try {
  for (const [w, h, label] of [[390, 844, "phone"], [1280, 800, "laptop"]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    page.on("pageerror", e => problems.push(`${label}: script error: ${e.message}`));
    // Only the local copy: skip fonts and the ask box (never spend AI questions).
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    for (const v of views) {
      await page.goto(base + "#" + v);
      await page.reload();
      const ok = await page.waitForFunction(() => {
        const h = document.querySelector("#hero");
        return h && h.textContent.trim().length > 0 && h.textContent;
      }, null, { timeout: 5000 }).then(x => x.jsonValue()).catch(() => "");
      if (!ok) problems.push(`${label} #${v}: no pick shown`);
      else if (/Couldn't load the picks/.test(ok)) problems.push(`${label} #${v}: "Couldn't load the picks"`);
      if (problems.length) break; // broken; no need to wait on every tab
    }
    if (problems.length) break;
    await page.close();
  }
} finally { await browser.close(); server.close(); }

for (const p of problems) console.log("✖ " + p);
console.log(problems.length ? `\n✖ ${problems.length} problem(s). Do not push.` : `✓ Page OK: ${views.length} tabs, phone and laptop size, no script errors.`);
process.exit(problems.length ? 1 : 0);
