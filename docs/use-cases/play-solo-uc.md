# 1. Use Case Specification: Play Solo

## 1.1 Brief Description
This use case allows users to play solo in an endless mode.
The game ends if the blocks stack up to the top of the board.

## 1.2 Mockup 
### Page to play a solo game
![Mockup solo game](../design/solo-game-mode.svg)

## 1.3 Screenshot
### Register functionality "game end"
![Solo game functionality "game end"](../design/solo-mode-end.svg)

### Register functionality "new highscore"
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
1. The user has to enter a valid password (e.g. with a minimal length)
2. The backend has to be running to save the new user and check if the password is valid

# 5. Postconditions

### 5.1 Save account
The new account has to be saved in the backend together with all its information.

# 6. Extension Points
n/a
