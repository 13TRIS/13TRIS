# 1. Use Case Specification: Search a Match

## 1.1 Brief Description

This use case allows users to search for a match. The user can play alone, against a bot or against another player.

## 1.2 Mockup

### Home page after clicking on card to search match (1vs1)
After clicking one of the cards on the home page an indicator that the game is loading or the user is searching will show.
![Mockup searching](../design/searching.svg)

# 2. Flow of Events

## 2.1 Basic Flow

Here is the activity diagram for searching a round of Tetris. After the user has visited the home page and clicked on a
"playing card" he must be marked as "playing". If he clicked the playing card for the 1vs1 mode he must be marked
as searching first. Searching players are matched against each other. Lastly a lobby for the game has to be created by
the backend and the game must be loaded.  
![Activity Diagram](./activity-diagrams/search-activity.svg)

## 2.2 Alternative Flows

n/a

## 2.3 Narrative
```gherkin
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
```

# 3. Special Requirements

n/a

# 4. Preconditions

The main preconditions for this use case are:

1. The user needs an account
2. Other players need to be searching for a game if playing 1 vs 1
3. The connection should not be interrupted while searching
4. The backend must be functional

# 5. Postconditions

### 5.1 Mark playing

Players in a lobby have to be marked as playing and have their searching tag removed.

### 5.2 Same lobby / same match

Players are put into the same lobby / same match. One player should not be match against another player form another
lobby.

# 6. Extension Points

n/a
