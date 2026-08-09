const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 5000 });
  } catch (e) {}

  await new Promise(r => setTimeout(r, 4000));
  
  try {
    const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
    require('fs').writeFileSync('debug_html.txt', rootHtml);
    console.log('Saved to debug_html.txt');
  } catch(e) {}

  await browser.close();
})();
