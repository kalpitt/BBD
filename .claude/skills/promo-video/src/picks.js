// Prints the live site's real top phone pick per budget and filter.
// Run from the repo root: python3 -m http.server 8765 & node .claude/skills/promo-video/src/picks.js
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const pg=await b.newPage();
  const combos=[];for(const u of ['','parents','battery','camera','gaming'])for(const v of [10000,15000,20000,25000,30000,35000,40000,50000])combos.push([v,u]);
  for(const [v,u] of combos){
    await pg.goto(`http://localhost:8765/#phones-${v}${u?"-"+u:""}`);await pg.reload();await pg.waitForTimeout(500);
    const t=await pg.evaluate(()=>{return document.querySelector('#hero').innerText.slice(0,200).replace(/\s+/g,' ')});
    console.log(v,u||'-','|',t);
  }
  await b.close();
})();
