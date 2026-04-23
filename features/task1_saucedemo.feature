Feature: SauceDemo Login

  Scenario: User logs in successfully
    Given I am logged in to Sauce Demo with username "standard_user" and password "secret_sauce"
    Then I should see the inventory page with 6 products
    Then I open Sauce Labs Backpack details and verify product details
    Then I click the 'Add to cart' button on the product details page
    Then I should see the cart badge with count 1
    Then I go to the checkout page
    Then selected item name should match checkout item name