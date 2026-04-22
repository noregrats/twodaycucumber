import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { Builder, WebDriver } from "selenium-webdriver";
import { SauceDemoLoginPage } from "./saucedemo_login.page";
import { SauceDemoInventoryPage } from "./saucedemo_inventory.page";

let driver: WebDriver;
let loginPage: SauceDemoLoginPage;

Given("I am on the SauceDemo login page", async function () {
  driver = await new Builder().forBrowser("chrome").build();
  loginPage = new SauceDemoLoginPage(driver);
  await loginPage.open();
});

When("I enter valid credentials", async function () {
  await loginPage.enterCredentials("standard_user", "secret_sauce");
});

When("I click the login button", async function () {
  await loginPage.clickLogin();
});

Then("I should be redirected to the inventory page", async function () {
  const atInventory = await loginPage.isAtInventoryPage();
  expect(atInventory).to.be.true;
  await driver.quit();
});

Then("the inventory should display {int} items", async function (count) {
  const actual = await loginPage.getInventoryItemCount();
  expect(actual).to.equal(count);
  await driver.quit();
});

Then("I open the details page for the Sauce Labs Backpack", async function () {
  const inventoryPage = new SauceDemoInventoryPage(driver);
  await inventoryPage.openBackpackDetails();
  const itemName = await driver
    .findElement({ xpath: "//div[@class='inventory_details_name large_size']" })
    .getText();
  console.log(`Opened details page for: ${itemName}`);
  await driver.quit();
});
