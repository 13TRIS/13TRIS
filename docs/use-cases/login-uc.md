# 1. Use Case Specification: Login

## 1.1 Brief Description
This use case allows users to login to an existing account.
The user has to identify himself with a unique username and a password.

## 1.2 Mockup
### Page to log in to an existing account
![Mockup login](../design/login.svg)

## 1.3 Screenshot
### Login functionality "input"
![Login functionality "input"](../design/loginwithcredentials.svg)

### Login functionality "wrong credentials" 
![Login functionality "wrong credentials"](../design/loginerror.svg)

# 2. Flow of Events

## 2.1 Basic Flow
Here is the activity diagram for logging in to an existing account.  
![Activity Diagram](./activity-diagrams/login-activity.svg)

## 2.2 Alternative Flows
n/a

# 3. Special Requirements
n/a

# 4. Preconditions
The main preconditions for this use case are:

 1. The user has a registered account.
 2. The user needs no valid cookie (otherwise he will be logged in automatically)
 3. The user needs to enter correct credentials
 4. The backend must be running

# 5. Postconditions

### 5.1 Update backend
The backend should mark the user as logged in.

# 6. Extension Points
n/a
