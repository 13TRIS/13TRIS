# Created by fgerv at 04.11.2021
Feature: Play 1vs1
  As a USER I
  want to play Tetris against another person.

  Background:
    Given The user is logged in
    And The user selected the game card "1vs1"

  Scenario: Player joins 1vs1 game
    Given I have the status "searching"
    When I am matched against another player
    Then My status should be updated to "playing"
    And I am redirected to the game page
    And I should be able to make inputs



