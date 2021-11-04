# Created by fgerv at 04.11.2021
Feature: Game Engine
  Basic test all around the game engine from functionality to rendering

  Scenario: Renders properly
    When The game board is initialized
    Then It should render properly with the correct resolution

  Scenario: Inputs work
    When The player hits keyboard keys
    Then The engine should perceive them
    And Perform actions accordingly

  Scenario: Game ends
    When The game board is initialized
    Then It should render properly with the correct resolution

  Scenario: Block collision

  Scenario: Rotate block

  Scenario: New Block after previous one is set

  Scenario: bla bla bla
