# Created by fgerv at 04.11.2021
Feature: Search match
  As a USER
  I want to search for a match.

  Background:
    Given The user is on the home page
    And The user is not currently in a game

  Scenario: Search 1vs1
    When I click the "1vs1" card
    Then I am marked as "searching"
    And I should see a visual representation of being in queue

  Scenario: Search solo game
    When I click the "Solo game" card
    Then A new lobby will be created
    And My status will change to "playing"
    And I am redirected to the game page

  Scenario: Search AI game
    When I click the "AI game" card
    Then A new lobby will be created
    And My status will change to "playing"
    And I am redirected to the game page

  Scenario: Search AI or solo game
    Given The following game modes
    |solo|
    |ai  |
    When I click the game mode card
    Then A new lobby will be created
    And My status will change to "playing"
    And I am redirected to the game page

