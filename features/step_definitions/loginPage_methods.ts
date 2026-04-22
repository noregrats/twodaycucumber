import { Page } from "playwright";

export async function loginToSauceDemo(
  page: Page,
  username: string,
  password: string,
) {
  await page.goto("https://www.saucedemo.com/");
  await page.fill("#user-name", username);
  await page.fill("#password", password);
  await page.click("#login-button");
  await page.waitForURL("**/inventory.html");
}
