Feature: Inventory display on SauceDemo

	@inventory
	Scenario: Inventory page shows 6 items after login
		Given I am on the SauceDemo login page
		When I enter valid credentials
		And I click the login button
		Then the inventory should display 6 items