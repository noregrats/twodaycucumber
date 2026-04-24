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
  sortProductsByPriceLowToHigh,
  addFirstTwoSortedProductsToCart,
  openBackpackDetailsAndVerify,
  clickAddToCartButton,
  getCartBadgeCount,
  goToCheckoutPage,
} from "./inventoryPage_methods";
import {
  assertItemNameMatchesCheckout,
  proceedToCheckoutAndFillRandomInfo,
  finishCheckoutAndVerifySuccess,
} from "./checkoutPage_methods";

let browser: Browser;
let page: Page;
let selectedItemName = "";

setDefaultTimeout(20 * 1000);

Before(async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
});

Given(
  "I log in to Sauce Demo for task2 with username {string} and password {string}",
  async function (username: string, password: string) {
    await loginToSauceDemo(page, username, password);
  },
);

Then(
  "I should see the task2 inventory page with 6 products",
  async function () {
    await verifyInventoryPage(page);
  },
);

Then("I sort products by price low to high", async function () {
  await sortProductsByPriceLowToHigh(page);
});

Then(
  "I add the first two products from the sorted list to the cart",
  async function () {
    await addFirstTwoSortedProductsToCart(page);
  },
);

Then("I should see the cart badge with count 2", async function () {
  const badgeCount = await getCartBadgeCount(page);
  if (badgeCount !== 2) {
    throw new Error(`Expected cart badge count to be 2, but got ${badgeCount}`);
  }
});

After(async function () {
  if (page) await page.close();
  if (browser) await browser.close();
});
