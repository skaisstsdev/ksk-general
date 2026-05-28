const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Log console messages inside the page
  page.on('console', msg => {
    console.log('[PAGE CONSOLE]', msg.text());
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.toString());
  });

  try {
    console.log('Navigating to http://localhost:3000/kontakt.html...');
    await page.goto('http://localhost:3000/kontakt.html', { waitUntil: 'networkidle2' });

    console.log('Filling form fields...');
    await page.type('input[name="vorname"]', 'Test');
    await page.type('input[name="nachname"]', 'User');
    await page.type('input[name="email"]', 'test@example.com');
    await page.type('input[name="telefon"]', '0123456789');
    await page.select('select[name="betreff"]', 'beratung');
    await page.type('textarea[name="nachricht"]', 'Test Message from Puppeteer');

    // Check the privacy policy checkbox
    console.log('Checking privacy checkbox...');
    await page.click('input[type="checkbox"]');

    // Intercept network request to EmailJS to inspect payload/headers/response
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('emailjs.com')) {
        console.log('[EmailJS Request URL]', request.url());
        console.log('[EmailJS Request PostData]', request.postData());
      }
      request.continue();
    });

    page.on('response', async response => {
      if (response.url().includes('emailjs.com')) {
        console.log('[EmailJS Response Status]', response.status());
        try {
          const text = await response.text();
          console.log('[EmailJS Response Body]', text);
        } catch (e) {
          console.log('[EmailJS Response Body Error]', e.message);
        }
      }
    });

    console.log('Submitting form...');
    await page.click('button[type="submit"]');

    console.log('Waiting for response...');
    await new Promise(resolve => setTimeout(resolve, 8000));

  } catch (error) {
    console.error('Test script error:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
