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
  clickAddToCartButton,
  getCartBadgeCount,
  goToCheckoutPage,
} from "./inventoryPage_methods";
import {
  assertItemIsNotInCheckout,
  assertCheckoutItemCount,
  assertCorrectProductsOnCheckoutOverview,
  proceedToCheckoutAndFillRandomInfo,
  finishCheckoutAndVerifySuccess,
  removeOneItemFromCheckoutPage,
} from "./checkoutPage_methods";

let browser: Browser;
let page: Page;
let removedItemName = "";
let addedProductNames: string[] = [];

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
    addedProductNames = await addFirstTwoSortedProductsToCart(page);
  },
);

Then("I should see the cart badge with count 2", async function () {
  const badgeCount = await getCartBadgeCount(page);
  if (badgeCount !== 2) {
    throw new Error(`Expected cart badge count to be 2, but got ${badgeCount}`);
  }
});

Then("I open checkout page, and remove one product", async function () {
  await goToCheckoutPage(page);
  removedItemName = await removeOneItemFromCheckoutPage(page);
});

Then(
  "I should not see the removed item in checkout overview",
  async function () {
    if (!removedItemName) {
      throw new Error("Removed item name was not captured before assertion.");
    }
    await assertItemIsNotInCheckout(page, removedItemName);
  },
);

Then("I should see exactly 1 item in checkout overview", async function () {
  await assertCheckoutItemCount(page, 1);
});

Then(
  "I should see the correct remaining product in checkout overview",
  async function () {
    const expectedNames = addedProductNames.filter(
      (n) => n !== removedItemName,
    );
    await assertCorrectProductsOnCheckoutOverview(page, expectedNames);
  },
);

Then(
  "I should see the cart badge with count 1 after removal",
  async function () {
    const badgeCount = await getCartBadgeCount(page);
    if (badgeCount !== 1) {
      throw new Error(
        `Expected cart badge count to be 1, but got ${badgeCount}`,
      );
    }
  },
);

Then(
  "I proceed to continue shopping and add one more product to cart",
  async function () {
    // #continue-shopping is on cart.html, not checkout overview — navigate there first
    await page.locator(".shopping_cart_link").click();
    await page.waitForURL("**/cart.html");
    await page.locator("#continue-shopping").click();
    await page.waitForURL("**/inventory.html");
    await clickAddToCartButton(page);
  },
);

Then("I should see the cart badge with count 2 again", async function () {
  const badgeCount = await getCartBadgeCount(page);
  if (badgeCount !== 2) {
    throw new Error(`Expected cart badge count to be 2, but got ${badgeCount}`);
  }
});

Then(
  "I proceed to task2 checkout and fill in random information",
  async function () {
    await proceedToCheckoutAndFillRandomInfo(page);
  },
);
Then("I finish task2 checkout and verify success", async function () {
  await finishCheckoutAndVerifySuccess(page);
});
After(async function () {
  if (page) await page.close();
  if (browser) await browser.close();
});
