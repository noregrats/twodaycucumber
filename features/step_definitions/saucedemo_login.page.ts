import { By, WebDriver, until } from "selenium-webdriver";

export class SauceDemoLoginPage {
  driver: WebDriver;
  url = "https://www.saucedemo.com/";

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(this.url);
  }

  async enterCredentials(username: string, password: string) {
    await this.driver.findElement(By.id("user-name")).sendKeys(username);
    await this.driver.findElement(By.id("password")).sendKeys(password);
  }

  async clickLogin() {
    await this.driver.findElement(By.id("login-button")).click();
  }

  async isAtInventoryPage() {
    await this.driver.wait(until.urlContains("inventory"), 5000);
    const url = await this.driver.getCurrentUrl();
    return url.includes("inventory");
  }

  async getInventoryItemCount() {
    const items = await this.driver.findElements(
      By.className("inventory_item"),
    );
    return items.length;
  }
}
