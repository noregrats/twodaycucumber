import { Page } from "playwright";

// ...existing code...
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

export async function openBackpackDetailsAndVerify(page: Page): Promise<void> {
  await page
    .locator(".inventory_item_name", { hasText: "Sauce Labs Backpack" })
    .first()
    .click();

  await page.waitForURL("**/inventory-item.html**");

  const name = (await page.textContent(".inventory_details_name"))?.trim();
  if (!name) {
    throw new Error("Product name is missing on details page.");
  }

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
}
export async function clickAddToCartButton(page: Page): Promise<void> {
  const addToCartButton = page
    .locator("button:has-text('Add to cart')")
    .first();

  await addToCartButton.waitFor({ state: "visible" });
  await addToCartButton.click();
}
