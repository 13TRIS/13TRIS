![image](Logo/Logo_full.png)

# Test Plan of 13TRIS

## Table of contents

- [1. Introduction](#1-introduction)
    * [1.1 Purpose](#11-purpose)
    * [1.2 Scope](#12-scope)
    * [1.3 Intended Audience](#13-intended-audience)
    * [1.4 Document Terminology and Acronyms](#14-document-terminology-and-acronyms)
    * [1.5  References](#15--references)
    * [1.6 Document Structure](#16-document-structure)
- [2. Evaluation Mission and Test Motivation](#2-evaluation-mission-and-test-motivation)
    * [2.1 Background](#21-background)
    * [2.2 Evaluation Mission](#22-evaluation-mission)
    * [2.3 Test Motivators](#23-test-motivators)
- [3. Target Test Items](#3-target-test-items)
- [4. Outline of Planned Tests](#4-outline-of-planned-tests)
    * [4.1 Outline of Test Inclusions](#41-outline-of-test-inclusions)
    * [4.2 Outline of Other Candidates for Potential Inclusion](#42-outline-of-other-candidates-for-potential-inclusion)
    * [4.3 Outline of Test Exclusions](#43-outline-of-test-exclusions)
- [5. Test Approach](#5-test-approach)
    * [5.1 Initial Test-Idea Catalogs and Other Reference Sources](#51-initial-test-idea-catalogs-and-other-reference-sources)
    * [5.2 Testing Techniques and Types](#52-testing-techniques-and-types)
        + [5.2.1 Data and Database Integrity Testing](#521-data-and-database-integrity-testing)
        + [5.2.2 Functional Testing](#522-functional-testing)
        + [5.2.3 Business Cycle Testing](#523-business-cycle-testing)
        + [5.2.4 User Interface Testing](#524-user-interface-testing)
        + [5.2.5 Performance Profiling](#525-performance-profiling)
        + [5.2.6 Load Testing](#526-load-testing)
        + [5.2.7 Stress Testing](#527-stress-testing)
        + [5.2.8 Volume Testing](#528-volume-testing)
        + [5.2.9 Security and Access Control Testing](#529-security-and-access-control-testing)
        + [5.2.10 Failover and Recovery Testing](#5210-failover-and-recovery-testing)
        + [5.2.11 Configuration Testing](#5211-configuration-testing)
        + [5.2.12 Installation Testing](#5212-installation-testing)
- [6. Entry and Exit Criteria](#6-entry-and-exit-criteria)
    * [6.1 Test Plan](#61-test-plan)
        + [6.1.1 Test Plan Entry Criteria](#611-test-plan-entry-criteria)
        + [6.1.2 Test Plan Exit Criteria](#612-test-plan-exit-criteria)
        + [6.1.3 Suspension and Resumption Criteria](#613-suspension-and-resumption-criteria)
    * [6.2 Test Cycles](#62-test-cycles)
        - [6.2.1 Test Cycle Entry Criteria](#621-test-cycle-entry-criteria)
        - [6.2.2 Test Cycle Exit Criteria](#622-test-cycle-exit-criteria)
        - [6.2.3 Test Cycle Abnormal Termination](#623-test-cycle-abnormal-termination)
- [7. Deliverables](#7-deliverables)
- [7.1 Test Evaluation Summaries](#71-test-evaluation-summaries)
- [7.2 Reporting on Test Coverage](#72-reporting-on-test-coverage)
- [7.3 Perceived Quality Reports](#73-perceived-quality-reports)
- [7.4 Incident Logs and Change Requests](#74-incident-logs-and-change-requests)
- [7.5 Smoke Test Suite and Supporting Test Scripts](#75-smoke-test-suite-and-supporting-test-scripts)
- [7.6      Additional Work Products](#76------additional-work-products)
    * [7.6.1     Detailed Test Results](#761-----detailed-test-results)
    * [7.6.2     Additional Automated Functional Test Scripts](#762-----additional-automated-functional-test-scripts)
    * [7.6.3     Test Guidelines](#763-----test-guidelines)
    * [7.6.4     Traceability Matrices](#764-----traceability-matrices)
- [8. Testing Workflow](#8-testing-workflow)
- [9. Environmental Needs](#9-environmental-needs)
    * [9.1 Base System Hardware](#91-base-system-hardware)
    * [9.2 Base Software Elements in the Test Environment](#92-base-software-elements-in-the-test-environment)
    * [9.3 Productivity and Support Tools](#93-productivity-and-support-tools)
    * [9.4 Test Environment Configurations](#94-test-environment-configurations)
- [10. Responsibilities, Staffing, and Training Needs](#10-responsibilities--staffing--and-training-needs)
    * [10.1 People and Roles](#101-people-and-roles)
    * [10.2 Staffing and Training Needs](#102-staffing-and-training-needs)
- [11. Iteration Milestones](#11-iteration-milestones)
- [12. Risks, Dependencies, Assumptions, and Constraints](#12-risks--dependencies--assumptions--and-constraints)
- [13. Management Process and Procedures](#13-management-process-and-procedures)

## 1. Introduction

### 1.1 Purpose

The purpose of the Iteration Test Plan is to gather all of the information necessary to plan and control the test effort
for a given iteration. It describes the approach to testing the software. This Test Plan for 13TRIS supports the
following objectives:

- Identifies the items that should be targeted by the tests.
- Identifies the motivation for and ideas behind the test areas to be covered.
- Outlines the testing approach that will be used.
- Identifies the required resources and provides an estimate of the test efforts.

### 1.2 Scope

So far we use the _unittest_ library of Python to test the functionality of the WebSocket server.

### 1.3 Intended Audience

We create this test plan for our project team so everyone knows what to test, how to test it and what features might
already be tested.

### 1.4 Document Terminology and Acronyms

| Abbr | Abbreviation                        |
|------|-------------------------------------|
| API  | Application Programmable Interface  |
| CI   | Continuous Integration              |
| CD   | Continuous Delivery/Deployment      |
| n/a  | not applicable                      |
| SRS  | Software Requirements Specification |
| tbd  | to be determined                    |
| UI   | User Interface                      |
| VC   | Version Control                     |
| TDD  | Test Driven Development             |

### 1.5  References

| Title                                                                   | Date       | Publishing organization   |
| ------------------------------------------------------------------------|:----------:| ------------------------- |
| [Blog](https://13tris.dkoeck.de/)                                                    | May 2022  |   13TRIS           |
| [GitHub Repository](https://github.com/13TRIS/13TRIS)                                | May 2022  |   13TRIS           |
| [UC1](./use-cases/login-uc.md)                                        | May 2022  |            13TRIS      |
| [UC2](./use-cases/play-1v1-uc.md)                                        | May 2022  |          13TRIS        |
| [UC3](./use-cases/play-solo-uc.md)                                        | May 2022  |        13TRIS          |
| [UC4](./use-cases/register-uc.md) | May 2022 | 13TRIS |
| [UC5](./use-cases/search-match-uc.md) | May 2022 | 13TRIS |
| [UC6](./use-cases/view-leaderboard.md) | May 2022 | 13TRIS |
| [Test Plan](./test_plan.md)                                              | May 2022  |       13TRIS           |
| [SRS](./SRS.md)                          | May 2022  |     13TRIS             |
| [SAD](./SAD.md)                               | May 2022  |      13TRIS            |

### 1.6 Document Structure

n/a

## 2. Evaluation Mission and Test Motivation

### 2.1 Background

Testing serves to ensure that the written code does what it is intended to do. It also prevents future code changes to
break existing functionality unnoticed. In the context of integration it can also prevent broken software states to be
merged into secured VC branches

### 2.2 Evaluation Mission

We want to provide our users with an error free experience of our application and deliver a stable product. Also, we
want to increase our own productivity during production by identifying bugs or breaking changes early on through our
tests.

### 2.3 Test Motivators

We want the users of our application and the stakeholders to be happy with the product.

## 3. Target Test Items

Every use case of our product should be targeted as a test item to ensure its functionality:

- UC1: Login
- UC2: Registration
- UC3: Playing Multiplayer
- UC4: Playing Solo
- UC5: Creating Lobbies
- UC6: View Leaderboard

## 4. Outline of Planned Tests

We want to achieve a code coverage of at least 20%.

### 4.1 Outline of Test Inclusions

**UC1: Login**

- Unit testing
- Different inputs
- Wrong username/password
- UI testing
- Django/Python

**UC2: Registration**

- Unit testing
- Different inputs
- Username already taken
- Password requirements not met
- UI testing
- Django/Python

**UC3: Play solo**

- Unit testing
- Functions in the game engine
- Player input
- UI testing
- JavaScript

**UC4: Play multiplayer**

- Unit testing
- Server communication
- Django/Python
- Player input

**UC5: Lobby creation**

- Unit testing
- Python
- Server communication

The tests themselves will not be tested and will not account into code coverage.

### 4.2 Outline of Other Candidates for Potential Inclusion

Testing with Gherkin/Cucumber and any UI tests are open for debate.

### 4.3 Outline of Test Exclusions

We will not test the database functionality itself because in our case this is already handled by Django and we did not
implement it ourselves.

## 5. Test Approach

Based on the items to test that were mentioned above we will investigate critical functionalities for the user and
create a test case for each functionality that makes sure everything is working as expected.

### 5.1 Initial Test-Idea Catalogs and Other Reference Sources

The use case specifications and corresponding activity diagrams can be used to determine what needs to be tested for
each use case.

### 5.2 Testing Techniques and Types

#### 5.2.1 Data and Database Integrity Testing

n/a

#### 5.2.2 Functional Testing

Test the behavior of single functions on different inputs.

|                       | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
|Technique Objective    |  Ensure that every function returns an expected result when given a specific input  |
|Technique              |  Use the standard _
unittest_ testing library of Python or another library for JavaScript functions|
|Oracles                |  GitHub actions and console output in the IDE  |
|Required Tools         |  Python interpreter; IDE; JavaScript library  |
|Success Criteria       |  All tests are successful in the IDE and on the GitHub runner |
|Special Considerations |  n/a  |

#### 5.2.3 Business Cycle Testing

n/a

#### 5.2.4 User Interface Testing

Use a UI testing library like Selenium to navigate through the web page like a real user and test if everything is
loaded/presented as intended.

|                       | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
|Technique Objective    |  Make sure the UI is presented as intended   |
|Technique              |  Create or modify tests for each window to verify proper navigation and object states for each application window and object.   |
|Oracles                |   GitHub actions and console output in the IDE  |
|Required Tools         |   UI testing library like Selenium  |
|Success Criteria       |   The tests pass on the developer's machine as well as on the GitHub runner. The UI should behave the same on all browsers!  |
|Special Considerations |   n/a  |

#### 5.2.5 Performance Profiling

We can use the developer tools of modern browsers to profile our web application.

|                       | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
|Technique Objective    |   Make sure that the application does not consume unnecessary resources.  |
|Technique              |   Use profiling tools integrated into the web browser ("Lighthouse" in Google Chrome)  |
|Oracles                |   Generated reports    |
|Required Tools         |   Modern web browser  |
|Success Criteria       |  Score at least 80/100   |
|Special Considerations |  n/a   |

#### 5.2.6 Load Testing

n/a

#### 5.2.7 Stress Testing

n/a

#### 5.2.8 Volume Testing

n/a

#### 5.2.9 Security and Access Control Testing

|                       | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
|Technique Objective    |  Trying to find bugs or vulnerabilities using corresponding tools   |
|Technique              |  Find a tool that analyses the code on this criteria and try to fix the things that get reported   |
|Oracles                |  Reports created by the tool |
|Required Tools         |  SonarCloud to analyze the code   |
|Success Criteria       |  No Bugs, Code Smells or vulnerabilities   |
|Special Considerations |  n/a   |

#### 5.2.10 Failover and Recovery Testing

n/a

#### 5.2.11 Configuration Testing

|                       | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
|Technique Objective    |   Verify that the product looks and works the same on every machine or software |
|Technique              |   Manually test the application on different operating systems and browsers  |
|Oracles                |   n/a  |
|Required Tools         |   Computer; internet connection; different browsers (Opera, Chrome, Firefox, Edge); different OS (Mac, Windows, Android, Linux)|
|Success Criteria       |   The functionalities and looks of the application are independent of the software it runs on  |
|Special Considerations |   n/a  |

#### 5.2.12 Installation Testing

There is no "installation" needed for the user.

n/a

## 6. Entry and Exit Criteria

### 6.1 Test Plan

#### 6.1.1 Test Plan Entry Criteria

Someone creates a pull request into the _main_ or _beta_ branch.

#### 6.1.2 Test Plan Exit Criteria

Either the GitHub runner executes the workflow successfully or he does not.

#### 6.1.3 Suspension and Resumption Criteria

n/a

### 6.2 Test Cycles

##### 6.2.1 Test Cycle Entry Criteria

n/a

##### 6.2.2 Test Cycle Exit Criteria

n/a

##### 6.2.3 Test Cycle Abnormal Termination

n/a

## 7. Deliverables

## 7.1 Test Evaluation Summaries

Beta  
[![Test and Build Phase : Beta](https://github.com/13TRIS/13TRIS/actions/workflows/Test_Build_Deploy.yml/badge.svg?branch=beta)](https://github.com/13TRIS/13TRIS/actions/workflows/Test_Build_Deploy.yml?query=branch%3Abeta)

Main  
[![Test and Build Phase : Main](https://github.com/13TRIS/13TRIS/actions/workflows/Test_Build_Deploy.yml/badge.svg?branch=main)](https://github.com/13TRIS/13TRIS/actions?query=branch%3Amain)

## 7.2 Reporting on Test Coverage

Last test-run:  
[![Alt text](https://gist.githubusercontent.com/MKrabs/c70e1f6335770b1a486128be085f2f3f/raw/b6a0bb58f504bd98dee911c4292e9bd593877cac/coverage.svg)](https://github.com/13TRIS/13TRIS/actions)

## 7.3 Perceived Quality Reports

n/a

## 7.4 Incident Logs and Change Requests

We use GitHub to track (breaking) changes, an overview of our code base and documentation and for reporting code
coverage and passing tests via badges. We use SonarCloud to analyze the code and track certain branches of our GitHub
repository.

## 7.5 Smoke Test Suite and Supporting Test Scripts

n/a

## 7.6      Additional Work Products

n/a

### 7.6.1     Detailed Test Results

n/a

### 7.6.2     Additional Automated Functional Test Scripts

Our tests reside inside our GitHub repository with all the other
code: [https://github.com/13TRIS/13TRIS](https://github.com/13TRIS/13TRIS). Test scripts so far:

- [test_server.py](https://github.com/13TRIS/13TRIS/blob/beta/djangoproject/tetris_app/test_server.py)
- more to come...

### 7.6.3     Test Guidelines

n/a

### 7.6.4     Traceability Matrices

n/a

## 8. Testing Workflow

1. Write new tests while implementing new functionality
2. Make sure tests run in the IDE of every developer before pushing to the repo
3. Push to the repo and create a pull request
4. Make sure the GitHub runner can execute the tests successfully before merging
5. At the end of the GitHub workflow a Discord notification is sent

## 9. Environmental Needs

This section presents the non-human resources required for the Test Plan.

### 9.1 Base System Hardware

The following table sets forth the system resources for the test effort presented in this Test Plan.

| Resource                                                                | Quantity | Name and Type |
|-------------------------------------------------------------------------|----------|---------------|
| Database Server                                                         |  1        |  Django DB             |
| Network connection                                                    |      1    | localhost           |
| Database                                                          |     1     | SQLite           |
| Test Development PCs                                                    |   1       | n/a           |
| Browser | 1 | Chrome, Firefox, Edge, Opera, ... |

### 9.2 Base Software Elements in the Test Environment

The following base software elements are required in the test environment for this Test Plan.

| Software Element Name |  Type and Other Notes                        |
|-----------------------|----------------------------------------------|
| PyCharm               | Test Runner / IDE                            |
| IntelliJ              | Test Runner / IDE                            |
| unittest              | Unit testing library for Python              |
| Selenium              | UI testing library                           |
| Cucumber              | human readable test definitions              |

### 9.3 Productivity and Support Tools

The following tools will be employed to support the test process for this Test Plan.

| Tool Category or Type             | Tool Brand Name | Vendor or In-house | Version |
|-----------------------------------|-----------------|--------------------|---------|
| Test Management                   |   PyCharm              |  JetBrains      2022.1            |         |
| Project Management                |  YouTrack               |     JetBrains               |         |
| DBMS tools                        |  SQLite with Django               |                    |         |

### 9.4 Test Environment Configurations

Currently, the only test environment that is needed is already integrated inside the IDE.

## 10. Responsibilities, Staffing, and Training Needs

### 10.1 People and Roles

This table shows the staffing assumptions for the test effort.

| Role                          |                               Minimum Resources Recommended (number of full-time roles allocated)                                          |    Specific Responsbilities or Comments                                                                                                                                                                                                                                                                                 |
|------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Test Manager                             |                  Felix Gervasi                                                       | Provides management oversight. Responsibilities include: planning and logistics agree mission identify motivators acquire appropriate resources present management reporting advocate the interests of test evaluate effectiveness of test effort                                 |
| Test Designer                            |                   Marc Gökce                                                      | Defines the technical approach to the implementation of the test effort. Responsibilities include: define test approace define test automation architecture verify test techniques define testability elements structure test implementation                                      |
| Tester                                   |             Marc Gökce, Felix Gervasi, Daniel Köck                                                            | Implements and executes the tests. Responsibilities include: implement tests and test suites execute test suites log results analyze and recover from test failures document incidents                                                                                            |
| Implementer                              |        Marc Gökce, Felix Gervasi, Daniel Köck                                                                 | Implements and unit tests the test classes and test packages. Responsibilities include: creates the test components required to support testability requirements as defined by the designer                                                                                       |

### 10.2 Staffing and Training Needs

n/a

## 11. Iteration Milestones

We want to keep over 20% code coverage.

## 12. Risks, Dependencies, Assumptions, and Constraints

We have a list of our risks created with Microsoft lists. You can find it following
this [link](https://lists.live.com/:l:/g/personal/af4e32ee5822202e/FA8opXAFjkFMuIRSrDKU9tkB1fzlbs7_kgN0QIQ_JleAPA?e=yYvmXN)
. We also have a markdown file but this one will most likely not be updated
anymore: [risks markdown](https://github.com/13TRIS/13TRIS/blob/b0a20072665ba28019909b8d9415801d4059045d/docs/Risk-management.md)
.

## 13. Management Process and Procedures

n/a
