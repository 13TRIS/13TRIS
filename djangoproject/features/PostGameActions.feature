# Created by fgerv at 04.11.2021
Feature: Post Game Actions
  As a USER
  I want my match results to be saved.

  Scenario: Game is over
    When The match is completed
    Then A new database entry should be saved
    And The fields should contain the correct usernames and date
    And My state "playing" should be removed
    And I am redirected to the end screen page