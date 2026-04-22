import {
  Given,
  Then,
  After,
  Before,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";
import { loginToSauceDemo } from "./loginPage_methods";
import {
  verifyInventoryPage,
  openBackpackDetailsAndVerify,
  clickAddToCartButton,
} from "./inventoryPage_methods";

let browser: Browser;
let page: Page;

setDefaultTimeout(60 * 1000);

Before(async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
});
Given(
  "I am logged in to Sauce Demo with username {string} and password {string}",
  async function (username: string, password: string) {
    await loginToSauceDemo(page, username, password);
  },
);

Then("I should see the inventory page with 6 products", async function () {
  await verifyInventoryPage(page);
});

Then(
  "I open Sauce Labs Backpack details and verify product details",
  async function () {
    await openBackpackDetailsAndVerify(page);
  },
);
Then(
  "I click the 'Add to cart' button on the product details page",
  async function () {
    await clickAddToCartButton(page);
  },
);

After(async function () {
  if (page) await page.close();
  if (browser) await browser.close();
});
