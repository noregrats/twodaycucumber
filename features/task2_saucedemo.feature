Feature: Task 2 - SauceDemo basic login

  Scenario: User logs in successfully
    Given I log in to Sauce Demo for task2 with username "standard_user" and password "secret_sauce"
    Then I should see the task2 inventory page with 6 products
    Then I sort products by price low to high
    Then I add the first two products from the sorted list to the cart
    Then I should see the cart badge with count 2
    Then I open checkout page, and remove one product
    Then I should not see the removed item in checkout overview
    Then I should see exactly 1 item in checkout overview
    Then I should see the correct remaining product in checkout overview
    Then I should see the cart badge with count 1 after removal
    Then I proceed to continue shopping and add one more product to cart
    Then I should see the cart badge with count 2 again
    Then I proceed to task2 checkout and fill in random information
    Then I finish task2 checkout and verify success
