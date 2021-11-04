# Created by fgerv at 04.11.2021
Feature: Register
  As a USER
  I want to register an new account by visiting the registration page.

  Background:
    Given The user visited the registration page

  Scenario: Registration successful
    Given The username is not in use
    And The password meets the specified requirements
    When I enter my desired username and password
    And I click the "Register" button
    Then I should be redirected to the login page
    And I should see the message "Account has been successfully created!" beneath the input fields

  Scenario: Registration unsuccessful (username already in use)
    Given The username is already in use
    When I enter my desired username and password
    And I click the "Register" button
    Then I should see the message "Username already exists" beneath the input fields

  Scenario: Registration unsuccessful (password does not meet requirements)
    Given The password does not meet the requirements
    When I enter my desired username and password
    And I click the "Register" button
    Then I should see the message "Password does not meet the requirements" beneath the input fields
