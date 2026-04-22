import { By, WebDriver } from "selenium-webdriver";

export class SauceDemoInventoryPage {
  driver: WebDriver;
  url = "https://www.saucedemo.com/";

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async openBackpackDetails() {
    // Find the Sauce Labs Backpack item and click its title or image to open details
    const backpackLink = await this.driver.findElement(
      By.xpath(
        "//div[@class='inventory_item_name' and text()='Sauce Labs Backpack']",
      ),
    );
    const itemName = await backpackLink.getText();
    await backpackLink.click();
    console.log(`Opened details page for: ${itemName}`);
  }
}
