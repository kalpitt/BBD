#!/usr/bin/env node
// Smoke test: opens the page in a headless browser, visits every tab (at its default,
// lowest and highest budget), opens a shared link's scratch card, and checks a pick
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
// Claude cloud sessions: /opt/pw-browsers. GitHub Actions: the runner's own Chrome.
const browser = await chromium.launch(process.env.PLAYWRIGHT_BROWSERS_PATH ? {} : { executablePath: "/opt/pw-browsers/chromium" })
  .catch(() => chromium.launch()).catch(() => chromium.launch({ channel: "chrome" }));
const heroText = page => page.waitForFunction(() => {
  const h = document.querySelector("#hero");
  return h && h.textContent.trim().length > 0 && h.textContent;
}, null, { timeout: 5000 }).then(x => x.jsonValue()).catch(() => "");
try {
  for (const [w, h, label] of [[390, 844, "phone"], [1280, 800, "laptop"]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    page.on("pageerror", e => problems.push(`${label}: script error: ${e.message}`));
    // Only the local copy: skip fonts and the ask box (never spend AI questions).
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    for (const v of views) {
      await page.goto(base + "#" + v);
      await page.reload(); // a reload skips the shared-link scratch card; it's tested below
      const ok = await heroText(page);
      if (!ok) problems.push(`${label} #${v}: no pick shown`);
      else if (/Couldn't load the picks/.test(ok)) problems.push(`${label} #${v}: "Couldn't load the picks"`);
      // Slide to both ends of the dial
      for (const end of ["min", "max"]) {
        await page.evaluate(end => { const r = document.querySelector("#budget"); r.value = r[end]; r.dispatchEvent(new Event("input", { bubbles: true })); }, end);
        if (!(await heroText(page))) problems.push(`${label} #${v} at ${end} budget: no pick or message shown`);
      }
      if (problems.length) break; // broken; no need to wait on every tab
    }
    if (problems.length) break;
    await page.close();
  }
  // A friend opening a shared link: scratch card appears, "Show my pick" reveals the pick
  if (!problems.length) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", e => problems.push(`shared link: script error: ${e.message}`));
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    await page.goto(base + "#phones-30000");
    const btn = page.locator(".scratch .btn");
    if (!(await btn.waitFor({ timeout: 5000 }).then(() => true, () => false))) problems.push("shared link #phones-30000: scratch card didn't appear");
    else {
      await btn.click();
      if (!(await page.waitForSelector(".scratch.done", { timeout: 5000 }).then(() => true, () => false))) problems.push("shared link: \"Show my pick\" didn't reveal the pick");
    }
    await page.close();
  }
  // Ask chat: the floating button opens it full screen; the phone's Back button closes it
  if (!problems.length) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", e => problems.push(`ask chat: script error: ${e.message}`));
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    await page.goto(base + "#phones");
    await page.reload();
    await heroText(page);
    const fab = page.locator("#askFab");
    if (!(await fab.isVisible())) problems.push("ask chat: floating button not visible");
    else {
      await fab.click();
      if (!(await page.locator("#askDlg[open] #q").isVisible())) problems.push("ask chat: tapping the floating button didn't open the chat");
      await page.goBack();
      if (await page.waitForFunction(() => !document.querySelector("#askDlg").open, null, { timeout: 3000 }).then(() => false, () => true)) problems.push("ask chat: Back button didn't close the chat");
      if (!page.url().startsWith(base)) problems.push("ask chat: Back button left the page");
    }
    await page.close();
  }
  // Laptop: the chat opens as a side panel
  if (!problems.length) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    page.on("pageerror", e => problems.push(`ask panel: script error: ${e.message}`));
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    await page.goto(base + "#phones");
    await page.reload();
    await heroText(page);
    await page.locator("#askFab").click();
    const w = await page.evaluate(() => document.querySelector("#askDlg").getBoundingClientRect().width);
    if (!(w > 300 && w < 600)) problems.push(`ask panel: expected a side panel on laptops, got width ${w}`);
    await page.keyboard.press("Escape");
    if (await page.evaluate(() => document.querySelector("#askDlg").open)) problems.push("ask panel: Escape didn't close it");
    await page.close();
  }
} finally { await browser.close(); server.close(); }

for (const p of problems) console.log("✖ " + p);
console.log(problems.length ? `\n✖ ${problems.length} problem(s). Do not push.` : `✓ Page OK: ${views.length} tabs at default, lowest and highest budget, phone and laptop size, shared-link scratch card, ask chat (phone + laptop), no script errors.`);
process.exit(problems.length ? 1 : 0);
