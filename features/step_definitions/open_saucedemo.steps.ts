import { Given, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import assert from 'assert';

let browser: Browser;
let page: Page;

Given('I open the SauceDemo page', { timeout: 30000 }, async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('https://www.saucedemo.com/');
});

Then('the page should display the login form', { timeout: 10000 }, async function () {
  const loginForm = await page.$('input[data-test="username"]');
  assert(loginForm !== null, 'Login form not found');
  await browser.close();
});
