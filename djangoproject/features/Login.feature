# Created by fgerv at 04.11.2021
Feature: Login
  As a USER
  I want to visit the login page and be able to fill in my credentials and login to my account.

Background:
  Given The user visited the login page

  Scenario: Login successful
    Given I have an account
    When I fill in the correct credentials
    And I click the "Login" button
    Then I should be redirected to my personal home page
    And I should see my friends list
    And I should see my username
    And I should see the game selection
    And I should see the leaderboard

  Scenario: Login unsuccessful
    Given I have an account
    When I fill in the wrong credentials
    And I click the "Login" button
    Then I should see the error message "The username and password don't match" beneath the input fields


