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
): Promise<void> {
  const addToCartButtons = page.locator(
    ".inventory_item button:has-text('Add to cart')",
  );
  const availableButtons = await addToCartButtons.count();

  if (availableButtons < 2) {
    throw new Error(
      `Expected at least 2 add-to-cart buttons, but found ${availableButtons}`,
    );
  }

  await addToCartButtons.nth(0).click();
  await addToCartButtons.nth(1).click();
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
