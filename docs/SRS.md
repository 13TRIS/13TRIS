![13TRIS! Welcome to the SRS](./Logo/Logo_full.png)

# 13TRIS - Software Requirements Specification

## Table of contents
- [Table of contents](#table-of-contents)
- [Introduction](#1-introduction)
    - [Preliminary](#10-preliminary)
    - [Purpose](#11-purpose)
    - [Scope](#12-scope)
    - [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    - [References](#14-references)
    - [Overview](#15-overview)
- [Overall Description](#2-overall-description)
    - [Vision](#21-vision)
    - [Use Case Diagram](#22-use-case-diagram)
    - [Technology Stack](#23-technology-stack)
- [Specific Requirements](#3-specific-requirements)
    - [Functionality](#31-functionality)
    - [Usability](#32-usability)
    - [Reliability](#33-reliability)
    - [Performance](#34-performance)
    - [Supportability](#35-supportability)
    - [Design Constraints](#36-design-constraints)
    - [Online User Documentation and Help System Requirements](#37-on-line-user-documentation-and-help-system-requirements)
    - [Purchased Components](#purchased-components)
    - [Interfaces](#39-interfaces)
    - [Licensing Requirements](#310-licensing-requirements)
    - [Legal, Copyright And Other Notices](#311-legal-copyright-and-other-notices)
    - [Applicable Standards](#312-applicable-standards)
- [Supporting Information](#4-supporting-information)

## 1. Introduction

### 1.0 Preliminary
The folowing Software Requirements Specification (SRS) is based on a [template](https://github.com/nilskre/CommonPlayground/blob/pm/docs/SoftwareRequirementsSpecification.md) given from Ms Berkling.

### 1.1 Purpose
This Software Requirements Specification (SRS) describes all specifications for the application "13TRIS". It includes an overview about this project and its vision, detailed information about the planned features and boundary conditions of the development process.


### 1.2 Scope
The project is going to be realized as a web based application.

Actors of this app can be users or administrators.

Planned subsystems are:
* Game lobbies:  
  Lobbies are game sessions with players, users _(not logged in)_ and / or bots. The main purpose is to host a game session to be able to play rounds between many parties. They can be created by any user. The lobby should delete itself once no more human players are in the lobby.
* Account system:  
  Users can create / edit / delete their personal accounts and login / authenticate with them. Accounts have to store data entries such as: total wins - friend list - and so on...
* Finding your game:  
  To be able to quickly join and play, users join a global queue through the click of a button and get flagged as 'searching'. An optional feature would be invite links to be able to create private matches.
* (optional) Inviting others to a game:  
  Any player can create an invite link to other people while waiting for the game to start. Other members can join via an invite, to which they don't necessarily need an account. They can only join if the game has not started yet (or they were already in the lobby).
* Leader board:  
  The leader board shows a sorted accumulation of the top players, ranked from highest win-count down to the lowest win-count:
  * [1] Player43 (45 wins)
  * [2] UserWithaHat (39 wins)
  * [3] BotMaverick (38 wins)
* Storing data:  
  User data for accounts has to be stored. The leaderboard, although also stored, will have to be recalculated each time.

### 1.3 Definitions, Acronyms and Abbreviations
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| SRS         | Software Requirements Specification    |
| UML         | Unified Modeling Language              |
| UCD         | Use Case Diagram                       |
 
### 1.4 References

| Title                                                              | Date       | Publishing organization   |
| -------------------------------------------------------------------|:----------:| ------------------------- |
| [Play 13TRIS](http://13tris.dkoeck.de/)                            | 23.10.2021 | 13TRIS Team               |
| [Our Blog 13TRIS](http://13tris.dkoeck.de/)                        | 23.10.2021 | 13TRIS Team               |
| [GitHub](hthttps://github.com/MKrabs/13TRIS)                       | 23.10.2021 | 13TRIS Team               |


### 1.5 Overview
The following chapter provides an overview of this project with vision and Overall Use Case Diagram. 
The third chapter (Specific Requirements) delivers more details about the specific requirements in terms of functionality, usability and design parameters. Finally there is a chapter with supporting information.

## 2. Overall Description

### 2.1 Vision
The vision of the 13TRIS team is to implement our own version of Tetris as a multiplayer web application.

### 2.2 Use Case Diagram

![13TRIS! Welcome to the SRS](.\diagrams\UML-use-case-diagram.drawio.svg)

- Green: Planned till end of december
- Blue: Planned till end of june
- Orange: Optional features

### 2.3 Technology Stack
The technologies we use are:

Backend:
- Django (Python)
- Database (SQLite)

Frontend:
-  React (JavaScript)

IDE:
- PyCharm

Project Management:
- YouTrack
- GitHub
- Signal + Discord

Deployment: (not yet decided)
- PythonAnywhere (host) 

Testing: (not yet decided)
- JEST
- Selenium / Cypress
- PyTest / unit testing

## 3. Specific Requirements

### 3.1 Functionality
This section will explain the different use cases, you could see in the Use Case Diagram, and their functionality.  
Until December, we plan to implement:
- 3.1.1 Creating an account
- 3.1.2 Logging in and out
- 3.1.3 Searching a match
- 3.1.4 Basic functionality of playing Tetris
- 3.1.5 Playing 1 vs 1 against another player
- 3.1.6 Creating or deleting a user 

Until June, we want to implement:
- 3.1.7 Choosing an opponent
- 3.1.8 Playing a bot game
- 3.1.9 Viewing the leader board

Optional features are:
- 3.1.10 Edit and view profile
- 3.1.11 Choosing the difficulty 
- 3.1.12 Creating a lobby and inviting friends

#### Until December, we want to implement:
#### 3.1.1 Creating an account
The users of our application will be able to create an account with a username and password. This will create a new unique user with a UUID, which will be used later to identify a player, store data about him and show his rank in the leader board. It is also important for keeping track of sessions.

#### 3.1.2 Logging in and out
For a player to identify himself and keep a record of his various informations (wins, status, etc.), it is possible to log in to an account.
After creating an account the user will be able to sign in and play the game. If he finished playing he is able to log out manually in case he shares his device, has multiple accounts or just want to be cautious about his privacy. 
This will also make it easier for us to create a leaderboard later which displays the best player of all time or the best recent player.

#### 3.1.3 Searching a match
In the application the user will be able to search for a match. If the user decides to search for a match he will be marked as "searching". All users who have this status come into question for being matched against one another.

####3.1.4 Basic functionality of playing Tetris
As we are making a tertis game the most important functionality is playing tetris. At first we implement it for one player alone (also known as infinity mode). 

#### 3.1.5 Playing 1 vs 1 against another player
After implementing the basic functionaliyt of Tetris we plan on making the 1 vs 1 mode work.

####3.1.6 Creating or deleting a user 
If the user wants to he will be able to delete his account. However, this is more of an administrative feature.


####Until June, we want to implement:

####3.1.7 Choosing an opponent
The player will be able to choose whether he wants to play against a human or the computer.

####3.1.8 Playing a bot game
We are planning on implementing the functionality of playing bot games. 

####3.1.9 Viewing the leader board
The user will be able to see the best players on a leaderboard.


####Optional features are:

####3.1.9 Edit and view profile
A possible feature in the future would be to expand the accounting system in a way that allows the user to view other profiles and edit his own profile. 
A profile should consist of not only the username and ID but also an optional profile picture, status message, description...
Sending text messages between users or in a game session is also imaginable.

####3.1.10 Choosing the difficulty
If the user wants to play against a bot he should have the oppertunity to choose between different levels of difficulty e.g. _hard_, _medium_, _easy_. 

####3.1.11 Creating a lobby and inviting friends
Another optional use case is the creation of custom lobbies. It would be nice to give the user the ability to create custom lobbies and invite friends into the lobby to make playing with friends possible.

### 3.2 Usability
We plan on designing the user interface as intuitive and self-explanatory as possible to make the user feel as comfortable as possible using the application. Though an FAQ document will be available, it should not be necessary to use it.

#### 3.2.1 No training time needed
The user should be able to start playing as soon as he registered an account. Otherwise it will be too frustrating to use the application. There should be no training required except learning to play the game itself of course.
We will have a section on the page which will help newcomers to learn the game.

#### 3.2.2 Familiar Feeling
We want to implement the game in a way so designs and functions feels familiar. This way the user is able to interact in familiar ways with the application without having to get to know new interfaces.

### 3.3 Reliability

#### 3.3.1 Availability
The server shall be available 95% of the time. This also means we have to figure out the "rush hours" of our app because the downtime of the server is only tolerable when as few as possible players want to use the app.
Availablity is very important especially in a game where server downtime or "lags" can be very frustrating to the player.

#### 3.3.2 Defect Rate
Our goal is that we have no loss of any data. This is important so that the game sessions can carry on, even after a downtime of the server.

### 3.4 Perfomance

#### 3.4.1 Capacity
The system should be able to manage the requests. Also it should be possible to register as many users as necessary.

#### 3.4.2 Storage
We are aiming to keep the needed storaged data e.g. cookies as small as possible.

#### 3.4.3 App perfomance / Response time
To provide the best app perfomance we aim to keep the response time as low as possible. This will make the user experience much better.

### 3.5 Supportability

#### 3.5.1 Coding Standards
We are going to write the code by using all of the most common clean code standards. For example we will name our variables and methods by their functionalities. This will keep the code easy to read by everyone and make further developement much easier.

#### 3.5.2 Testing Strategy
The application will have a high test coverage and all important functionalities and edge cases should be tested. Further mistakes in the implementation will be discovered instantly and it will be easy to locate the error.

### 3.6 Design Constraints
We are trying to provide a modern and easy to handle design for the UI aswell as for the architecture of our application. To achieve that the functionalities will be kept as modular as possible.

Because we are progamming an web application and wanted to learn something new we chose Python, JavaScript and React as our tech stack. Also we are using a common architecture to keep the front end and back end seperated.
To make the communication between the two parts easy, we will implement websockets between them which will provide the exchange of data.

### 3.7 On-line User Documentation and Help System Requirements
The usage of the application should be as intuitive as possible so it won't need any further documentation. If the user needs some help we will implement a "Help"-Button in the App which includes a FAQ and a formular to contact the developement team.

### 3.8 Purchased Components
We don't have any purchased components yet. If there will be purchased components in the future we will list them here.

### 3.9 Interfaces

#### 3.9.1 User Interfaces
The User interfaces that will be implented are:
- Login - this page is used to log in
- Register - provides a registration form
- Home page - here the user can search for a game and see important information about himself or others (leader board)
- Game view - here the player can play the game and the inputs of the users get processed
- Imprint - contact data and general information about the team/application
- Privacy policy - information for the user about how the application collects data
- Leader board - a detailed view of the leaderboard 
- Admin site - admins can create or delete user accounts and manage the application

Optional user interfaces that may be implemented:
- Friend list - friends can be added
- Profile - makes it possible to post information about yourself, might provide messaging feature, also shows additional information about users (for example: language, country, favorite games, etc.)
- Edit profile - a user can edit his/her own profile
- Create lobby - a site where the user can create a lobby and adjust its settings

#### 3.9.2 Hardware Interfaces
(n/a)

#### 3.9.3 Software Interfaces
The app will run in all modern browsers like Edge, Chrome or Firefox.

#### 3.9.4 Communication Interfaces
The backend/frontend communication during a game will be handled with websockets. To request information about users the HTTP protocol can be used.  

### 3.10 Licensing Requirements

### 3.11 Legal, Copyright, and Other Notices
The logo is licensed to the 13TRIS Team and is only allowed to use for the application. We do not take responsibilty for any incorrect data or errors in the application.

### 3.12 Applicable Standards
The development will follow the common clean code standards and naming conventions. Also we want to follow standards concerning the usage of Git e.g. consistent commit messages (see https://www.conventionalcommits.org/en/v1.0.0/). 


## 4. Supporting Information
For any further information you can contact the 13TRIS Team or check our [13Tris Blog](http://13tris.dkoeck.de/).
The Team Members are:
- Daniel Majer
- Daniel Koeck
- Ishan Signh
- Felix Gervasi
- Marc Goetsche