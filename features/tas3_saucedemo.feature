Feature: Task 3 - SauceDemo context-based logins

  @contextA
  Scenario: Context A logs in as standard user
    Then I should be logged in for task3
    Then in context A I add one item to cart
    Then in context A I should see cart badge count 1

  @contextB
  Scenario: Context B logs in as problem user
    Then I should be logged in for task3