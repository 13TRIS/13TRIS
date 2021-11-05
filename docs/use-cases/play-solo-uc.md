# 1. Use Case Specification: Play Solo

## 1.1 Brief Description
This use case allows users to play solo in an endless mode.
The game ends if the blocks stack up to the top of the board.

## 1.2 Mockup 
### Page to play a solo game
The page for the solo game mode will only show one game board of the current player. The design might change
in the future.
![Mockup solo game](../design/solo-game-mode.svg)

## 1.3 Screenshot
### Solo game Functionality "Game over"
When the player has lost the game we need to show an end screen and the score that he reached.
![Solo game functionality "game end"](../design/solo-mode-end.svg)

### Functionality "new highscore"
If the player surpassed his last highscore the game will display a different message in the end of the game.
![Solo game functionality "highscore"](../design/solo-mode-highscore.svg)

# 2. Flow of Events

## 2.1 Basic Flow
Here is the activity diagram for playing a solo game. First the game board will be initialized and a new random block is generated.
Afterwards the game will constantly be updated while the user has the ability to perform different actions like moving or rotating
the block. The inputs will be sent to the backend which checks if the block is actually still movable. If not the game might
be finished or a new block has to be generated. At the end the game has to be saved to the history and an end screen will 
be prompted to the user.  
![Activity Diagram](./activity-diagrams/solo-game-activity.svg)

## 2.2 Alternative Flows
n/a

## 2.3 Narrative
```gherkin
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
```

# 3. Special Requirements
n/a

# 4. Preconditions
The main preconditions for this use case are:
1. The user has an account
2. The user is not currently in another lobby
3. The connection between front- and backend is uninterrupted 


# 5. Postconditions
1. Save information about the match for the player in the database (e.g. score, date, lobby).
2. Remove the current player from the lobby

# 6. Extension Points
n/a
