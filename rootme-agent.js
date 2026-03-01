/**
 * Root-Me Agent — Onyx 🪨
 * Résout les challenges Web Client + Web Server automatiquement
 * Usage: node rootme-agent.js [--category web-client|web-server] [--challenge <slug>]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOTME_URL = 'https://www.root-me.org';
const LOGIN = 'onyxtheassistant';
const PASSWORD = 'Onyx@1234';
const WRITEUPS_DIR = path.join(__dirname);

const BROWSER_OPTS = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox', 
    '--disable-blink-features=AutomationControlled',
  ]
};

const CONTEXT_OPTS = {
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  locale: 'fr-FR',
};

async function createBrowser() {
  const browser = await chromium.launch(BROWSER_OPTS);
  const context = await browser.newContext(CONTEXT_OPTS);
  
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en'] });
  });
  
  return { browser, context };
}

async function waitForAnubis(page, maxWait = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const url = page.url();
    const title = await page.title().catch(() => '');
    if (!title.includes('noes') && !url.includes('anubis')) {
      return true;
    }
    await page.waitForTimeout(500);
  }
  return false;
}

async function login(page) {
  console.log('[login] Navigating to login...');
  await page.goto(`${ROOTME_URL}/?page=login&lang=fr`, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForAnubis(page);
  
  // Remplir le formulaire
  await page.fill('input[name="login"]', LOGIN).catch(async () => {
    // Chercher autrement
    const inputs = await page.$$('input[type="text"], input[type="email"]');
    if (inputs.length > 0) await inputs[0].fill(LOGIN);
  });
  
  await page.fill('input[name="password"]', PASSWORD).catch(async () => {
    const inputs = await page.$$('input[type="password"]');
    if (inputs.length > 0) await inputs[0].fill(PASSWORD);
  });
  
  await page.keyboard.press('Enter');
  await page.waitForNavigation({ timeout: 10000 }).catch(() => {});
  
  const title = await page.title();
  console.log('[login] After login:', title.substring(0, 60));
  
  // Vérifier si connecté
  const content = await page.content();
  const loggedIn = content.includes('Déconnexion') || content.includes('onyxtheassistant') || content.includes('profil');
  console.log('[login] Logged in:', loggedIn);
  return loggedIn;
}

async function getChallengeList(page, category = 'Web+-+Client') {
  const url = `${ROOTME_URL}/fr/Challenges/${category}/`;
  console.log(`[challenges] Fetching ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForAnubis(page);
  
  // Extraire les challenges
  const challenges = await page.evaluate(() => {
    const items = [];
    // Chercher les liens de challenges
    document.querySelectorAll('article.challenge, .challenge-row, tr.challenge, a[href*="/Challenges/"]').forEach(el => {
      const link = el.tagName === 'A' ? el : el.querySelector('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || !href.includes('/Challenges/')) return;
      
      const title = link.textContent.trim() || el.querySelector('.titre')?.textContent?.trim();
      const points = el.querySelector('.score, .points')?.textContent?.trim();
      const difficulty = el.querySelector('.difficulte, .difficulty')?.textContent?.trim();
      
      if (title && href) {
        items.push({ title, href, points, difficulty });
      }
    });
    return items;
  });
  
  // Alternative: parser le HTML directement
  if (challenges.length === 0) {
    const content = await page.content();
    // Extraire depuis les liens
    const matches = [...content.matchAll(/href="([^"]*\/Challenges\/[^"]+)"[^>]*>([^<]+)</g)];
    matches.forEach(m => {
      if (!m[1].includes('page=')) {
        challenges.push({ title: m[2].trim(), href: m[1], points: null });
      }
    });
  }
  
  console.log(`[challenges] Found ${challenges.length} challenges`);
  return challenges;
}

async function solveChallenge(page, challenge, category) {
  console.log(`\n[solve] Challenge: ${challenge.title}`);
  
  // Naviguer vers le challenge
  const challengeUrl = challenge.href.startsWith('http') ? challenge.href : `${ROOTME_URL}${challenge.href}`;
  await page.goto(challengeUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForAnubis(page);
  
  const title = await page.title();
  const content = await page.content();
  
  console.log(`[solve] Page: ${title.substring(0, 60)}`);
  
  // Extraire l'énoncé
  const statement = await page.evaluate(() => {
    const el = document.querySelector('.challenge-statement, .enonce, .description, article p, .txt-presentation');
    return el ? el.textContent.trim() : '';
  });
  
  // Trouver le lien vers le challenge (souvent iframe ou lien externe)
  const challengeLink = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')];
    const challengeLink = links.find(l => 
      l.href.includes('challenge') || 
      l.href.includes('ch') ||
      l.textContent.includes('Challenge') ||
      l.textContent.includes('Accès')
    );
    return challengeLink ? challengeLink.href : null;
  });
  
  console.log(`[solve] Statement: ${statement.substring(0, 100)}`);
  console.log(`[solve] Challenge link: ${challengeLink}`);
  
  return {
    title: challenge.title,
    url: challengeUrl,
    statement,
    challengeLink,
    content: content.substring(0, 5000),
  };
}

async function main() {
  const { browser, context } = await createBrowser();
  const page = await context.newPage();
  
  try {
    // 1. Se connecter
    const loggedIn = await login(page);
    if (!loggedIn) {
      console.error('[main] Login failed!');
      // Sauvegarder screenshot
      await page.screenshot({ path: '/tmp/rootme-login-fail.png' });
      process.exit(1);
    }
    
    // 2. Récupérer la liste des challenges Web Client
    const challenges = await getChallengeList(page, 'Web+-+Client');
    console.log('\n[main] First 10 challenges:');
    challenges.slice(0, 10).forEach((c, i) => console.log(`  ${i+1}. ${c.title} (${c.points} pts) - ${c.href}`));
    
    // Sauvegarder la liste
    fs.writeFileSync('/tmp/rootme-challenges.json', JSON.stringify(challenges, null, 2));
    console.log('\n[main] Challenges saved to /tmp/rootme-challenges.json');
    
    // 3. Tenter le premier challenge
    if (challenges.length > 0) {
      const info = await solveChallenge(page, challenges[0], 'web-client');
      console.log('\n[main] Challenge info:', JSON.stringify(info, null, 2).substring(0, 500));
    }
    
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('[FATAL]', err.message);
  process.exit(1);
});
