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
    selectedItemName = await openBackpackDetailsAndVerify(page);
    console.log(
      `Verified product details for Sauce Labs Backpack: Name - ${selectedItemName}`,
    );
  },
);

Then(
  "I click the 'Add to cart' button on the product details page",
  async function () {
    await clickAddToCartButton(page);
  },
);

Then("I should see the cart badge with count 1", async function () {
  const badgeCount = await getCartBadgeCount(page);
  if (badgeCount !== 1) {
    throw new Error(`Expected cart badge count to be 1, but got ${badgeCount}`);
  }
});

Then("I go to the checkout page", async function () {
  await goToCheckoutPage(page);
});

Then("selected item name should match checkout item name", async function () {
  await assertItemNameMatchesCheckout(page, selectedItemName);
});

Then("I proceed to checkout and fill in random information", async function () {
  const { firstName, lastName, zipCode } =
    await proceedToCheckoutAndFillRandomInfo(page);
  console.log(
    `Filled checkout info: First Name - ${firstName}, Last Name - ${lastName}, ZIP Code - ${zipCode}`,
  );
});
Then("I finish checkout and verify success", async function () {
  await finishCheckoutAndVerifySuccess(page);
});

After(async function () {
  if (page) await page.close();
  if (browser) await browser.close();
});
