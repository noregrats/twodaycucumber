Feature: Task 4 - Add one item and verify badge

	Scenario: Standard user adds one product and sees badge count 1
		Given I log in as standard user for task4
		Then I add one product to cart in task4
		Then I should see cart badge count 1 in task4
		Then I save current cart badge count in task4
		Then I logout and login as visual user in task4
		Then I should see the same cart badge count after relogin in task4

	Scenario: Visual user logs in and sees empty cart badge
		Given I log in as visual user for task4
		Then I reset app state in task4
		Then I should see cart badge count 0 in task4
