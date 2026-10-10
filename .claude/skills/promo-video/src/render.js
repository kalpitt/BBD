// Usage: node render.js preview 1.2 4 8 ...   -> PNG stills
//        node render.js video out.mp4          -> silent 30fps video
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const { spawn } = require('child_process');
const path = require('path');
const FPS = 30, DUR = 24.5;
const data = require('/home/user/BBD/data.json');

(async () => {
  const [mode, ...args] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'scene.html'));
  await page.evaluate(() => document.fonts.ready);
  const names = data.products.map(p => p.n).sort((a, b) => (a.length * 7 % 13) - (b.length * 7 % 13));
  await page.evaluate(n => window.init(n), names);
  await page.waitForTimeout(500);
  if (mode === 'preview') {
    for (const t of args) {
      await page.evaluate(t => window.render(t), +t);
      await page.screenshot({ path: path.join(__dirname, `prev_${t}.png`) });
    }
  } else if (mode === 'frames') {
    const fs = require('fs'); fs.mkdirSync(path.join(__dirname, 'frames'), { recursive: true });
    const [a, b] = args.map(Number);
    for (let f = a; f < b; f++) {
      await page.evaluate(t => window.render(t), f / FPS);
      await page.screenshot({ path: path.join(__dirname, 'frames', `f${String(f).padStart(4, '0')}.png`) });
    }
  } else {
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', FPS, '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', args[0]], { stdio: ['pipe', 'ignore', 'inherit'] });
    for (let f = 0; f < FPS * DUR; f++) {
      await page.evaluate(t => window.render(t), f / FPS);
      ff.stdin.write(await page.screenshot({ type: 'png' }));
      if (f % 60 === 0) console.log('frame', f);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
