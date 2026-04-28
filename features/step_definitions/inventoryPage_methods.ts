import { Page } from "playwright";

export async function verifyInventoryPage(page: Page): Promise<void> {
  await page.waitForURL("**/inventory.html");

  const inventoryTitle = await page.textContent(".title");
  if (inventoryTitle?.trim() !== "Products") {
    throw new Error("Inventory page not displayed");
  }

  const productCount = await page.locator(".inventory_item").count();
  if (productCount !== 6) {
    throw new Error(`Expected 6 products, but found ${productCount}`);
  }
}

export async function sortProductsByPriceLowToHigh(page: Page): Promise<void> {
  const sortDropdown = page
    .locator("select.product_sort_container, .product_sort_container select")
    .first();
  await sortDropdown.waitFor({ state: "visible" });
  await sortDropdown.selectOption("lohi");

  const selectedValue = await sortDropdown.inputValue();
  if (selectedValue !== "lohi") {
    throw new Error(
      `Failed to sort products by price low to high. Selected value: ${selectedValue}`,
    );
  }
}

export async function addFirstTwoSortedProductsToCart(
  page: Page,
): Promise<string[]> {
  const inventoryItems = page.locator(".inventory_item");
  const availableCount = await inventoryItems.count();

  if (availableCount < 2) {
    throw new Error(
      `Expected at least 2 inventory items, but found ${availableCount}`,
    );
  }

  const names: string[] = [];
  for (let i = 0; i < 2; i++) {
    const item = inventoryItems.nth(i);
    const name = (
      await item.locator(".inventory_item_name").textContent()
    )?.trim();
    if (!name) {
      throw new Error(`Could not read name for inventory item at index ${i}`);
    }
    names.push(name);
    await item.locator("button:has-text('Add to cart')").click();
  }

  return names;
}

export async function openBackpackDetailsAndVerify(
  page: Page,
): Promise<string> {
  await page
    .locator(".inventory_item_name", { hasText: "Sauce Labs Backpack" })
    .first()
    .click();

  await page.waitForURL("**/inventory-item.html**");

  const name = (await page.textContent(".inventory_details_name"))?.trim();
  if (!name) {
    throw new Error("Product name is missing on details page.");
  }
  console.log(`Product name on details page: ${name}`);
  const description = (
    await page.textContent(".inventory_details_desc")
  )?.trim();
  if (!description) {
    throw new Error("Product description is missing on details page.");
  }

  const price = (await page.textContent(".inventory_details_price"))?.trim();
  if (!price) {
    throw new Error("Product price is missing on details page.");
  }

  const addToCartVisible = await page
    .locator("button:has-text('Add to cart')")
    .isVisible();
  if (!addToCartVisible) {
    throw new Error("'Add to cart' button is not visible on details page.");
  }
  return name;
}
export async function getCartBadgeCount(page: Page): Promise<number> {
  const badge = page.locator(".shopping_cart_badge");

  if ((await badge.count()) === 0) {
    return 0;
  }

  const badgeText = (await badge.first().textContent())?.trim();
  const badgeCount = Number(badgeText);
  console.log(`Cart badge count: ${badgeCount}`);

  if (Number.isNaN(badgeCount)) {
    throw new Error(`Invalid cart badge count: ${badgeText}`);
  }
  return badgeCount;
}
export async function clickAddToCartButton(page: Page): Promise<void> {
  const addToCartButton = page
    .locator("button:has-text('Add to cart')")
    .first();
  await addToCartButton.waitFor({ state: "visible" });
  await addToCartButton.click();

  // Optional stability check: button changes after adding
  await page
    .locator("button:has-text('Remove')")
    .first()
    .waitFor({ state: "visible" });
}

export async function goToCheckoutPage(page: Page): Promise<void> {
  // Cart
  await page.locator(".shopping_cart_link").click();
  await page.waitForURL("**/cart.html");

  // Checkout step one
  await page.locator("#checkout").click();
  await page.waitForURL("**/checkout-step-one.html");

  // Required customer info
  await page.fill("#first-name", "Test");
  await page.fill("#last-name", "User");
  await page.fill("#postal-code", "12345");

  // Checkout overview (items visible here)
  await page.locator("#continue").click();
  await page.waitForURL("**/checkout-step-two.html");
}

export async function openSidePanelAndLogout(page: Page): Promise<void> {
  const sideMenuButton = page.locator("#react-burger-menu-btn");
  await sideMenuButton.waitFor({ state: "visible" });
  await sideMenuButton.click();

  const logoutLink = page.locator("#logout_sidebar_link");
  await logoutLink.waitFor({ state: "visible" });
  await logoutLink.click();

  await page.waitForURL("**/");

  const loginButtonVisible = await page.locator("#login-button").isVisible();
  if (!loginButtonVisible) {
    throw new Error("Logout failed: login page was not displayed.");
  }
}

export async function resetAppStateAndVerifyLocalStorageCleared(
  page: Page,
): Promise<void> {
  const sideMenuButton = page.locator("#react-burger-menu-btn");
  await sideMenuButton.waitFor({ state: "visible" });
  await sideMenuButton.click();

  const resetAppStateLink = page.locator("#reset_sidebar_link");
  await resetAppStateLink.waitFor({ state: "visible" });
  await resetAppStateLink.click();

  await page.waitForFunction(() => {
    const cartContents = window.localStorage.getItem("cart-contents");
    return cartContents === null || cartContents === "[]";
  });

  const storageState = await page.evaluate(() => {
    const entries = Object.entries(window.localStorage);
    return {
      length: window.localStorage.length,
      entries,
      cartContents: window.localStorage.getItem("cart-contents"),
    };
  });

  const cartCleared =
    storageState.cartContents === null || storageState.cartContents === "[]";

  // SauceDemo/backtrace can keep telemetry keys in localStorage.
  const meaningfulEntries = storageState.entries.filter(
    ([key]) => !key.startsWith("backtrace-"),
  );
  const storageCleared =
    meaningfulEntries.length === 0 ||
    (meaningfulEntries.length === 1 &&
      meaningfulEntries[0][0] === "cart-contents" &&
      cartCleared);

  if (!storageCleared) {
    throw new Error(
      `Reset App State did not clear localStorage. Current entries: ${JSON.stringify(
        storageState.entries,
      )}`,
    );
  }
}
