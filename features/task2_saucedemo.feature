Feature: Task 2 - SauceDemo basic login

  Scenario: User logs in successfully
    Given I log in to Sauce Demo for task2 with username "standard_user" and password "secret_sauce"
    Then I should see the task2 inventory page with 6 products
    Then I sort products by price low to high
    Then I add the first two products from the sorted list to the cart
    Then I should see the cart badge with count 2
