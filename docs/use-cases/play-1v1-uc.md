# 1. Use Case Specification: Play 1 vs 1

## 1.1 Brief Description
This use case allows users to play against another human player.
The game ends if the blocks stack up to the top of the board of one player.
This player will lose while the other player will win the game.

## 1.2 Mockup 
### Page to play a 1vs1 match
![Mockup 1v1 mode](../design/game-mode-1v1.svg)

## 1.3 Screenshot
### Versus game Functionality "match lost"
![Solo game functionality "game end"](../design/1v1lose.svg)

### Versus game Functionality "match won"
![Solo game functionality "highscore"](../design/1v1win.svg)

# 2. Flow of Events

## 2.1 Basic Flow
Here is the activity diagram for playing a solo game.  
![Activity Diagram](./activity-diagrams/1v1-game-activity.svg)

## 2.2 Alternative Flows
n/a

# 3. Special Requirements
n/a

# 4. Preconditions
The main preconditions for this use case are:
1. Both users have an account
2. Both users are currently in the same lobby
3. The connection between front- and backend is uninterrupted 


# 5. Postconditions
1. Save information about the match for both players in the database (e.g. score, date, lobby, opponent).
2. Remove the current players from the lobby

# 6. Extension Points
n/a
