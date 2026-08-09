const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 5000 });
  } catch (e) {
    console.log('Goto timeout (expected):', e.message);
  }

  // Wait 5 seconds for Preloader to disappear and animations to run
  await new Promise(r => setTimeout(r, 5000));
  
  try {
    const screenshotPath = path.join(__dirname, 'homepage_final.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);

    const destPath = 'C:\\Users\\Radha Ravichandran\\.gemini\\antigravity\\brain\\1da43467-68d0-4e09-8426-3f1252cb8ce0\\homepage_final.png';
    fs.copyFileSync(screenshotPath, destPath);
    console.log('Screenshot copied to artifacts.');
  } catch(e) {
    console.log('Error evaluating page:', e.message);
  }

  await browser.close();
  console.log('Done.');
})();
