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

export async function proceedToCheckoutAndFillRandomInfo(
  page: Page,
): Promise<{ firstName: string; lastName: string; zipCode: string }> {
  const randomText = (prefix: string) =>
    `${prefix}${Math.random().toString(36).slice(2, 8)}`;
  const randomZip = () => String(Math.floor(10000 + Math.random() * 90000));

  const firstName = randomText("FN_");
  const lastName = randomText("LN_");
  const zipCode = randomZip();

  await page.locator(".shopping_cart_link").click();
  await page.waitForURL("**/cart.html");

  await page.locator("#checkout").click();
  await page.waitForURL("**/checkout-step-one.html");

  await page.fill("#first-name", firstName);
  await page.fill("#last-name", lastName);
  await page.fill("#postal-code", zipCode);

  await page.locator("#continue").click();
  await page.waitForURL("**/checkout-step-two.html");

  return { firstName, lastName, zipCode };
}

export async function finishCheckoutAndVerifySuccess(
  page: Page,
): Promise<void> {
  await page.locator("#finish").click();
  await page.waitForURL("**/checkout-complete.html");

  const successHeader = page.locator(".complete-header");
  await successHeader.waitFor({ state: "visible" });

  const message = (await successHeader.textContent())?.trim();
  if (!message || !/thank you for your order!/i.test(message)) {
    throw new Error(`Unexpected success message: "${message ?? ""}"`);
  }
}
