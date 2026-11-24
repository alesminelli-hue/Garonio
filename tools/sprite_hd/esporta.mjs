// Esporta i fogli d'anteprima in PNG.
// Uso: node tools/sprite_hd/esporta.mjs <cartella-uscita> [sezione]
// (serve un server statico sulla radice del repo: python3 -m http.server 8765)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2] || 'anteprima';
const only = process.argv[3] || '';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', m => console.log('[pagina]', m.text()));
page.on('pageerror', e => console.log('[errore]', e.message));
await page.goto(`http://localhost:8765/tools/sprite_hd/anteprima.html${only ? '?s=' + only : ''}`);
await page.waitForFunction(() => window.PRONTO === true, null, { timeout: 30000 });
const fogli = await page.evaluate(() => Object.fromEntries(Object.entries(window.FOGLI).map(([k, c]) => [k, c.toDataURL('image/png')])));
for (const [k, url] of Object.entries(fogli)) {
  const f = path.join(outDir, `${k}.png`);
  fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
  console.log('scritto', f);
}
await browser.close();
