# Created by fgerv at 04.11.2021
Feature: Play solo game
  As a USER I
  want to play Tetris in endless mode.

  Background:
    Given The user is logged in
    And The user selected game card "solo game"

  Scenario: Player joins solo game
    Given The lobby was created
    When I am redirected to the game page
    Then My status should be updated to "playing"
    And I should see the game board
    And I should be able to make inputs



