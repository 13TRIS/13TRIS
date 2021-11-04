# Created by fgerv at 04.11.2021
Feature: View Leaderboard
  As a USER
  I want to view the best players on the leaderboard and filter by various criteria.

  Background:
    Given The user is logged in
    And The user is visiting the home page

  Scenario Outline: Change view
    When I click the tab <tab> above the leaderboard
    Then I should see the user <name>

    Examples:
      | tab  | name      |
      | solo | UserSolo  |
      | mmr  | UserMMR   |
      | 1vs1 | UserOther |
      | bot  | UserOther |
