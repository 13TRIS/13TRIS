# 1. Use Case Specification: Play Solo

## 1.1 Brief Description
This use case allows users to play solo in an endless mode.
The game ends if the blocks stack up to the top of the board.

## 1.2 Mockup 
### Page to play a solo game
![Mockup solo game](../design/solo-game-mode.svg)

## 1.3 Screenshot
### Solo game Functionality "Game over"
![Solo game functionality "game end"](../design/solo-mode-end.svg)

### Functionality "new highscore"
![Solo game functionality "highscore"](../design/solo-mode-highscore.svg)

# 2. Flow of Events

## 2.1 Basic Flow
Here is the activity diagram for playing a solo game.  
![Activity Diagram](./activity-diagrams/solo-game-activity.svg)

## 2.2 Alternative Flows
n/a

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
