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

export async function removeOneItemFromCheckoutPage(
  page: Page,
): Promise<string> {
  await page.waitForURL("**/checkout-step-two.html");

  const checkoutItems = page.locator(".cart_item");
  const initialCount = await checkoutItems.count();
  if (initialCount < 1) {
    throw new Error("No items are available to remove on checkout page.");
  }

  const removeButtonsOnOverview = page.locator(
    ".cart_item button:has-text('Remove'), .cart_item button[data-test^='remove-']",
  );

  // SauceDemo typically does not allow removing items on checkout overview,
  // so remove from cart and return to checkout overview.
  if ((await removeButtonsOnOverview.count()) < 1) {
    await page.locator(".shopping_cart_link").click();
    await page.waitForURL("**/cart.html");

    const cartItems = page.locator(".cart_item");
    const cartInitialCount = await cartItems.count();
    if (cartInitialCount < 1) {
      throw new Error("No items are available to remove in cart.");
    }

    const removedItemName = (
      await page
        .locator(".cart_item .inventory_item_name")
        .first()
        .textContent()
    )?.trim();
    if (!removedItemName) {
      throw new Error("Could not resolve removed item name in cart.");
    }

    const removeButtonsInCart = page.locator(
      ".cart_item button:has-text('Remove'), .cart_item button[data-test^='remove-']",
    );
    if ((await removeButtonsInCart.count()) < 1) {
      throw new Error("Remove button was not found in cart.");
    }

    await removeButtonsInCart.first().click();

    const expectedCount = cartInitialCount - 1;
    await page.waitForFunction(
      ({ selector, count }) =>
        document.querySelectorAll(selector).length === count,
      { selector: ".cart_item", count: expectedCount },
    );

    const cartFinalCount = await cartItems.count();
    if (cartFinalCount !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} item(s) after cart removal, but found ${cartFinalCount}.`,
      );
    }

    await page.locator("#checkout").click();
    await page.waitForURL("**/checkout-step-one.html");
    await page.fill("#first-name", "Test");
    await page.fill("#last-name", "User");
    await page.fill("#postal-code", "12345");
    await page.locator("#continue").click();
    await page.waitForURL("**/checkout-step-two.html");
    await assertItemIsNotInCheckout(page, removedItemName);
    await assertCheckoutItemCount(page, expectedCount);
    return removedItemName;
  }

  const removedItemName = (
    await page.locator(".cart_item .inventory_item_name").first().textContent()
  )?.trim();
  if (!removedItemName) {
    throw new Error("Could not resolve removed item name on checkout page.");
  }

  await removeButtonsOnOverview.first().click();

  const expectedCount = initialCount - 1;
  await page.waitForFunction(
    ({ selector, count }) =>
      document.querySelectorAll(selector).length === count,
    { selector: ".cart_item", count: expectedCount },
  );

  const finalCount = await checkoutItems.count();
  if (finalCount !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} item(s) after removal, but found ${finalCount}.`,
    );
  }

  await assertItemIsNotInCheckout(page, removedItemName);

  return removedItemName;
}

export async function assertItemIsNotInCheckout(
  page: Page,
  removedItemName: string,
): Promise<void> {
  await page.waitForURL("**/checkout-step-two.html");

  const checkoutItemNames = (
    await page.locator(".cart_item .inventory_item_name").allTextContents()
  )
    .map((name) => name.trim())
    .filter(Boolean);

  if (checkoutItemNames.includes(removedItemName.trim())) {
    throw new Error(
      `Removed item "${removedItemName}" is still visible in checkout. Remaining items: ${checkoutItemNames.join(", ")}`,
    );
  }
}

export async function assertCheckoutItemCount(
  page: Page,
  expectedCount: number,
): Promise<void> {
  await page.waitForURL("**/checkout-step-two.html");

  const actualCount = await page.locator(".cart_item").count();
  if (actualCount !== expectedCount) {
    throw new Error(
      `Expected checkout item count to be ${expectedCount}, but got ${actualCount}.`,
    );
  }
}

export async function continueShopping(page: Page): Promise<void> {
  const continueShoppingButton = page.locator(
    "#continue-shopping, button:has-text('Continue Shopping'), a:has-text('Continue Shopping')",
  );
  await continueShoppingButton.waitFor({ state: "visible" });
  await continueShoppingButton.click();
  await page.waitForURL("**/inventory.html");

  const inventoryTitle = await page.textContent(".title");
  if (inventoryTitle?.trim() !== "Products") {
    throw new Error(
      `Expected to land on inventory page after continuing shopping, but got title: "${inventoryTitle?.trim()}"`,
    );
  }
}

export async function assertCorrectProductsOnCheckoutOverview(
  page: Page,
  expectedNames: string[],
): Promise<void> {
  await page.waitForURL("**/checkout-step-two.html");

  const itemNamesLocator = page.locator(".cart_item .inventory_item_name");
  await itemNamesLocator.first().waitFor({ state: "visible" });

  const actualNames = (await itemNamesLocator.allTextContents()).map((n) =>
    n.trim(),
  );

  const missing = expectedNames.filter((n) => !actualNames.includes(n));
  const unexpected = actualNames.filter((n) => !expectedNames.includes(n));

  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      [
        "Checkout overview product mismatch.",
        missing.length > 0 ? `Missing: ${missing.join(", ")}` : "",
        unexpected.length > 0 ? `Unexpected: ${unexpected.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
}
