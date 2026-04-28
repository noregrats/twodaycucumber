import {
  Given,
  Then,
  Before,
  After,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";
import { loginToSauceDemo } from "./loginPage_methods";
import {
  clickAddToCartButton,
  getCartBadgeCount,
  openSidePanelAndLogout,
  resetAppStateAndVerifyLocalStorageCleared,
} from "./inventoryPage_methods";

let browser: Browser;
let page: Page;
let badgeCountBeforeLogout = 0;

setDefaultTimeout(20 * 1000);

Before(async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
});

Given("I log in as standard user for task4", async function () {
  await loginToSauceDemo(page, "standard_user", "secret_sauce");
});

Given("I log in as visual user for task4", async function () {
  await loginToSauceDemo(page, "visual_user", "secret_sauce");
});

Then("I reset app state in task4", async function () {
  await resetAppStateAndVerifyLocalStorageCleared(page);
});

Then("I add one product to cart in task4", async function () {
  await clickAddToCartButton(page);
});

Then(
  "I should see cart badge count {int} in task4",
  async function (expectedCount: number) {
    const badgeCount = await getCartBadgeCount(page);
    if (badgeCount !== expectedCount) {
      throw new Error(
        `Expected cart badge count to be ${expectedCount}, but got ${badgeCount}`,
      );
    }
  },
);

Then("I save current cart badge count in task4", async function () {
  badgeCountBeforeLogout = await getCartBadgeCount(page);
});

Then("I logout and login as visual user in task4", async function () {
  await openSidePanelAndLogout(page);
  await loginToSauceDemo(page, "visual_user", "secret_sauce");
});

Then(
  "I should see the same cart badge count after relogin in task4",
  async function () {
    const badgeCountAfterRelogin = await getCartBadgeCount(page);
    if (badgeCountAfterRelogin !== badgeCountBeforeLogout) {
      throw new Error(
        `Expected cart badge count to remain ${badgeCountBeforeLogout} after relogin, but got ${badgeCountAfterRelogin}`,
      );
    }
  },
);

After(async function () {
  if (page) await page.close();
  if (browser) await browser.close();
});
