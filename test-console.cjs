const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER_LOG: ${msg.type().toUpperCase()} - ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`BROWSER_PAGEERROR: ${error.message}`);
  });

  page.on('requestfailed', request => {
    console.log(`BROWSER_REQUESTFAILED: ${request.url()} - ${request.failure().errorText}`);
  });

  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 5000 });
  } catch (e) {
    console.log('Goto timeout (expected):', e.message);
  }

  // Wait 15 seconds
  await new Promise(r => setTimeout(r, 15000));
  
  await browser.close();
  console.log('Done.');
})();
