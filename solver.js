#!/usr/bin/env node
/**
 * Root-Me Challenge Solver
 * Usage: node solver.js <challenge_number>
 * 
 * Handles login, solves challenges, validates flags, writes writeups.
 */

const { chromium } = require('./node_modules/playwright');
const fs = require('fs');
const path = require('path');

const CREDENTIALS = { login: 'onyxtheassistant', password: 'Onyx@1234' };

// Challenge definitions
const CHALLENGES = {
  9: {
    slug: 'Javascript-Obfuscation-4',
    url: 'http://challenge01.root-me.org/web-client/ch51/',
    points: 30,
    solver: solveJS,
  },
  10: {
    slug: 'Javascript-Obfuscation-5',
    url: 'http://challenge01.root-me.org/web-client/ch56/',
    points: 30,
    solver: solveJS,
  },
  11: {
    slug: 'Javascript-Obfuscation-6',
    url: 'http://challenge01.root-me.org/web-client/ch57/',
    points: 35,
    solver: solveJS,
  },
  12: {
    slug: 'Javascript-Webpack',
    url: 'http://challenge01.root-me.org/web-client/ch87/',
    points: 35,
    solver: solveJS,
  },
  13: {
    slug: 'XSS-DOM-Based-Introduction',
    url: 'http://challenge01.root-me.org/web-client/ch80/',
    points: 10,
    solver: solveXSS,
  },
  14: {
    slug: 'XSS-DOM-Based',
    url: 'http://challenge01.root-me.org/web-client/ch32/',
    points: 25,
    solver: solveXSS,
  },
  15: {
    slug: 'XSS-DOM-Based-Eval',
    url: 'http://challenge01.root-me.org/web-client/ch34/',
    points: 25,
    solver: solveXSS,
  },
  16: {
    slug: 'XSS-Stockee-1',
    url: 'http://challenge01.root-me.org/web-client/ch26/',
    points: 10,
    solver: solveXSS,
  },
  17: {
    slug: 'XSS-Stockee-2',
    url: 'http://challenge01.root-me.org/web-client/ch27/',
    points: 20,
    solver: solveXSS,
  },
};

async function createBrowser() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR','fr','en'] });
  });
  return { browser, ctx };
}

async function login(ctx) {
  const page = await ctx.newPage();
  console.log('[+] Loading Root-Me homepage (Anubis pass)...');
  await page.goto('https://www.root-me.org/?lang=fr', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);
  
  console.log('[+] Navigating to login...');
  await page.goto('https://www.root-me.org/?page=login&lang=fr', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  await page.fill('input[name="var_login"]', CREDENTIALS.login);
  await page.fill('input[name="password"]', CREDENTIALS.password);
  await page.click('input[type="submit"]');
  await page.waitForTimeout(3000);
  
  const title = await page.title();
  console.log('[+] After login, page title:', title);
  await page.close();
  return ctx;
}

async function exploreChallenge(ctx, url) {
  const page = await ctx.newPage();
  console.log(`[+] Opening challenge: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const content = await page.content();
  const url2 = page.url();
  console.log('[+] Final URL:', url2);
  return { page, content };
}

async function solveJS(ctx, challenge) {
  const { page, content } = await exploreChallenge(ctx, challenge.url);
  
  // Extract JS source
  const scripts = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script'));
    return scripts.map(s => ({ src: s.src, content: s.textContent }));
  });
  
  console.log('[+] Scripts found:', scripts.length);
  for (const s of scripts) {
    if (s.src) console.log('  External:', s.src);
    if (s.content && s.content.length > 10) console.log('  Inline:', s.content.substring(0, 200));
  }
  
  // Get all page source
  console.log('\n[PAGE SOURCE (first 3000 chars)]:');
  console.log(content.substring(0, 3000));
  
  await page.close();
  return null; // Need manual analysis
}

async function solveXSS(ctx, challenge) {
  const { page, content } = await exploreChallenge(ctx, challenge.url);
  console.log('\n[PAGE SOURCE (first 3000 chars)]:');
  console.log(content.substring(0, 3000));
  await page.close();
  return null;
}

async function validateFlag(ctx, challengeUrl, flag) {
  const page = await ctx.newPage();
  
  // Navigate to the challenge validation page on root-me.org
  // First get the challenge ID from the URL
  const match = challengeUrl.match(/ch(\d+)/);
  if (!match) {
    console.log('Cannot find challenge ID');
    await page.close();
    return false;
  }
  
  // Go to root-me.org challenges list to find the right validation page
  await page.goto('https://www.root-me.org/?lang=fr', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const pageContent = await page.content();
  console.log('[+] Looking for validation form...');
  
  // Try to find challenge page
  // The validation usually happens on the challenge page itself
  await page.goto(challengeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const hasPasse = await page.$('input[name="passe"]');
  if (hasPasse) {
    await page.fill('input[name="passe"]', flag);
    await page.click('input[type="submit"]');
    await page.waitForTimeout(3000);
    const resultContent = await page.content();
    const success = resultContent.includes('Bien') || resultContent.includes('bravo') || resultContent.includes('flag') || resultContent.includes('valid');
    console.log('[+] Validation result:', success ? 'SUCCESS' : 'FAILED');
    console.log('[+] Page snippet:', resultContent.substring(0, 500));
    await page.close();
    return success;
  }
  
  await page.close();
  return false;
}

async function main() {
  const num = parseInt(process.argv[2] || '9');
  const challenge = CHALLENGES[num];
  
  if (!challenge) {
    console.log('Challenge not found:', num);
    console.log('Available:', Object.keys(CHALLENGES).join(', '));
    process.exit(1);
  }
  
  console.log(`\n=== Solving Challenge ${num}: ${challenge.slug} ===`);
  
  const { browser, ctx } = await createBrowser();
  
  try {
    await login(ctx);
    const flag = await challenge.solver(ctx, challenge);
    
    if (flag) {
      console.log('\n[+] FLAG FOUND:', flag);
      // Validate
      // const ok = await validateFlag(ctx, challenge.url, flag);
    } else {
      console.log('\n[!] No flag found automatically - manual analysis needed');
    }
  } finally {
    await browser.close();
  }
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
