import { Page } from "playwright";

export async function getCheckoutItemNames(page: Page): Promise<string[]> {
  const itemNamesLocator = page.locator(".cart_item .inventory_item_name");

  await itemNamesLocator.first().waitFor({ state: "visible" });

  const itemNames = await itemNamesLocator.allTextContents();
  const normalized = itemNames.map((name) => name.trim()).filter(Boolean);

  if (normalized.length === 0) {
    throw new Error("No checkout items were found.");
  }

  return normalized;
}

export async function assertItemNameMatchesCheckout(
  page: Page,
  selectedItemName: string,
): Promise<void> {
  const checkoutItemNames = await getCheckoutItemNames(page);

  if (!checkoutItemNames.includes(selectedItemName.trim())) {
    throw new Error(
      `Selected item "${selectedItemName}" was not found in checkout. Found: ${checkoutItemNames.join(", ")}`,
    );
  }
}
