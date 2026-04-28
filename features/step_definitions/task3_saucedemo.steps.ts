import { Before, After, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";
import { loginToSauceDemo } from "./loginPage_methods";
import {
  clickAddToCartButton,
  getCartBadgeCount,
} from "./inventoryPage_methods";

let browser: Browser;
let page: Page;

setDefaultTimeout(20 * 1000);

Before(async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
});

Before({ tags: "@contextA" }, async function () {
  await loginToSauceDemo(page, "standard_user", "secret_sauce");
});

Before({ tags: "@contextB" }, async function () {
  await loginToSauceDemo(page, "problem_user", "secret_sauce");
});

Then("I should be logged in for task3", async function () {
  await page.waitForURL("**/inventory.html");

  const pageTitle = (await page.textContent(".title"))?.trim();
  if (pageTitle !== "Products") {
    throw new Error(
      `Expected inventory page title to be "Products", but got "${pageTitle ?? ""}"`,
    );
  }
});

Then("in context A I add one item to cart", async function () {
  await clickAddToCartButton(page);
});

Then("in context A I should see cart badge count 1", async function () {
  const badgeCount = await getCartBadgeCount(page);
  if (badgeCount !== 1) {
    throw new Error(`Expected cart badge count to be 1, but got ${badgeCount}`);
  }
});

After(async function () {
  if (page) await page.close();
  if (browser) await browser.close();
});
