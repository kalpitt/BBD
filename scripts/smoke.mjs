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
  // "Message Kalpit": everyone gets the form. A family link (?f=code) leaves the address bar; with
  // FAM_HASH set (since 12 Oct) a wrong code (dummy number 911234567890 here) must keep the form
  const famSet = /const FAM_HASH="[0-9a-f]{64}"/.test(await readFile(join(root, "index.html"), "utf8"));
  if (!problems.length) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", e => problems.push(`message Kalpit: script error: ${e.message}`));
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    await page.goto(base + "#phones");
    await heroText(page);
    if (await page.evaluate(() => document.querySelector("#msgForm").hidden || !document.querySelector("#famWa").hidden)) problems.push("message Kalpit: a normal visitor should get the form, not WhatsApp");
    await page.locator("#askTeaser .toK").click();
    if (!(await page.locator("#askDlg[open] #mText").isVisible())) problems.push('message Kalpit: "Or message me" didn\'t open the chat at the form');
    await page.locator("#askClose").click();
    await page.waitForTimeout(300); // closing steps the browser history back once
    await page.goto(base + "?f=ai8j5mmb#phones");
    await page.reload();
    await heroText(page);
    await page.waitForTimeout(2500); // the code is checked with a slow hash
    const st = await page.evaluate(() => ({ wa: !document.querySelector("#famWa").hidden, form: !document.querySelector("#msgForm").hidden, url: location.href }));
    if (famSet && (st.wa || !st.form)) problems.push("message Kalpit: a family link with the wrong code switched the card to WhatsApp (FAM_HASH check)");
    if (!famSet && (!st.wa || st.form)) problems.push("message Kalpit: the family link didn't switch the card to WhatsApp");
    if (/[?&]f=/.test(st.url)) problems.push("message Kalpit: the family code stayed in the address bar");
    await page.close();
  }
  // Keyboard (12 Oct): the first Tab offers "Skip to my pick", and choosing a category with
  // Enter keeps focus on that chip (the chip rows are rebuilt)
  if (!problems.length) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", e => problems.push(`keyboard: script error: ${e.message}`));
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    await page.goto(base);
    await heroText(page);
    await page.keyboard.press("Tab");
    if (!(await page.evaluate(() => document.activeElement.classList.contains("skip")))) problems.push('keyboard: the first Tab should reach "Skip to my pick"');
    await page.focus("#cats .chip:nth-child(2)");
    const label = await page.evaluate(() => document.activeElement.textContent);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    if (await page.evaluate(l => document.activeElement.textContent !== l, label)) problems.push("keyboard: choosing a category with Enter lost the focus");
    await page.close();
  }
  // Visitor feedback (12 Oct): the finder respects a typed budget, "Show me" never puts an
  // affiliate item's exact price in the budget box, a note sends, and coming back from a store
  // asks "Did it look right?" with its two-step answers
  if (!problems.length) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", e => problems.push(`feedback: script error: ${e.message}`));
    await page.route(u => !u.href.startsWith(base), r => r.abort());
    await page.route(u => u.pathname.endsWith("/msg"), r => r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
    await page.goto(base + "#laptops-90000");
    await page.reload();
    await heroText(page);
    const affLaptop = data.products.find(x => x.cat === "laptops" && x.aff);
    const brand = affLaptop.n.split(" ")[0];
    await page.fill("#wText", `${brand} laptop under 20k`);
    await page.waitForTimeout(500);
    const capHint = await page.textContent("#wHint");
    if (!capHint.includes("Nothing like that under ₹20,000")) problems.push(`feedback: "${brand} laptop under 20k" should say nothing fits that budget, got: ${capHint.slice(0, 80)}`);
    await page.fill("#wText", brand);
    await page.waitForTimeout(500);
    const show = page.locator("#wHint [data-show]").first();
    if (!(await show.count())) problems.push(`feedback: typing "${brand}" showed no matching pick`);
    else {
      const id = await show.getAttribute("data-show"), x = data.products.find(y => y.id === id);
      await show.click();
      await page.waitForTimeout(400);
      const box = +(await page.inputValue("#budgetText")).replace(/\D/g, "");
      if (x.aff && box === x.p) problems.push(`feedback: "Show me" put ${x.n}'s exact price in the budget box (affiliate item)`);
    }
    await page.fill("#wText", "A Sony camera please");
    await page.click("#wSend");
    await page.waitForTimeout(400);
    if (!(await page.textContent("#wState")).includes("Got it")) problems.push("feedback: the 'Didn't see what you wanted?' note didn't confirm");
    const vis = v => page.evaluate(v => { Object.defineProperty(document, "visibilityState", { value: v, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); }, v);
    await page.evaluate(() => scrollTo(0, 0));
    await page.evaluate(() => document.querySelector("#hero a[data-c]").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
    await vis("hidden"); await page.waitForTimeout(4200); await vis("visible"); await page.waitForTimeout(300);
    if (!(await page.locator("#nudge").isVisible())) problems.push("feedback: coming back from a store didn't ask 'Did it look right?'");
    else {
      await page.click('#nudge [data-r="off"]');
      await page.click('#nudge [data-r="oos"]');
      if (!(await page.textContent("#nudge")).includes("I'll check it")) problems.push("feedback: 'Out of stock' didn't answer");
      await page.keyboard.press("Escape");
      if (await page.locator("#nudge").isVisible()) problems.push("feedback: Escape didn't close the card");
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
console.log(problems.length ? `\n✖ ${problems.length} problem(s). Do not push.` : `✓ Page OK: ${views.length} tabs at default, lowest and highest budget, phone and laptop size, shared-link scratch card, ask chat (phone + laptop), message-Kalpit form and family link, visitor feedback, keyboard, no script errors.`);
process.exit(problems.length ? 1 : 0);
