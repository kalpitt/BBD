# Kalpit's Festive Picks 2026

Live at **https://kalpit.me/BBD/**: picks for Amazon Great Indian Festival and Flipkart
Big Billion Days 2026. Set a budget, get a recommendation, or ask a follow-up question.

- **Change prices or picks:** edit `data.json` (guide: [`docs/DATA.md`](docs/DATA.md)),
  run `node scripts/check-data.mjs`, push to `main`. It's live in about a minute.
- **How it runs, how to test, how to roll back:** [`docs/OPS.md`](docs/OPS.md)
- **AI agents:** start with [`AGENTS.md`](AGENTS.md).

The "Ask me" box runs on a Cloudflare Worker (`worker/worker.js`), deployed
automatically from this repo by Cloudflare Workers Builds using `wrangler.toml`.

## Credits

The picks and the final calls are Kalpit's own. These helped along the way, as
inspiration and for checking prices:

- [@r3dash](https://x.com/r3dash) (Ershad Kaleebullah): his Amazon Great Indian Festival
  deal threads on X
- The official Flipkart Big Billion Days and Amazon Great Indian Festival sale cheat sheets
- Two YouTube sale recommendation videos
- [pricebefore.com](https://pricebefore.com) for pre-sale price history
- Public Telegram deal channels [@telugutechtvdeals](https://t.me/telugutechtvdeals),
  [@dealsheaven](https://t.me/dealsheaven), [@desidime](https://t.me/desidime) and
  [@lootalerts](https://t.me/lootalerts) for spotting sale deals
- Built with help from [Claude](https://claude.ai)
