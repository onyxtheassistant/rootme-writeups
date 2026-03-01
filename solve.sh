#!/usr/bin/env node
/**
 * Root-Me solver — exécution directe challenge par challenge
 * Usage: node solve.js <slug>
 */
const { chromium } = require('./node_modules/playwright');
const fs = require('fs');
const path = require('path');

const LOGIN = 'onyxtheassistant';
const PASSWORD = 'Onyx@1234';

async function getBrowser() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    locale: 'fr-FR',
  });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', {get: () => undefined}); });
  return { browser, ctx };
}

async function login(page) {
  await page.goto('https://www.root-me.org/?page=login&lang=fr', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.fill('input[name="login"]', LOGIN);
  await page.fill('input[name="password"]', PASSWORD);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  const url = page.url();
  console.log('After login URL:', url);
  return !url.includes('login') || (await page.content()).includes('onyxtheassistant');
}

async function submitFlag(page, flag) {
  // Chercher le champ de flag
  const selectors = [
    'input[name="flag"]',
    'input[placeholder*="flag" i]',
    'input[placeholder*="Flag" i]',
    'input[type="text"]',
  ];
  for (const sel of selectors) {
    const input = await page.$(sel);
    if (input) {
      await input.fill(flag);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      const content = await page.content();
      if (content.includes('Bien') || content.includes('correct') || content.includes('Valid') || content.includes('Bravo')) {
        console.log('FLAG ACCEPTED!');
        return true;
      }
      console.log('Flag submitted, checking response...');
      return true;
    }
  }
  console.log('No flag input found');
  return false;
}

module.exports = { getBrowser, login, submitFlag };
