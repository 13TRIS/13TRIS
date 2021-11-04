from behave import *

use_step_matcher("re")


@given("The user visited the login page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given The user visited the login page')


@given("I have an account")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given I have an account')


@when("I fill in the correct credentials")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I fill in the correct credentials')


@step('I click the "Login" button')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I click the "Login" button')


@then("I should be redirected to my personal home page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then I should be redirected to my personal home page')


@step("I should see my friends list")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I should see my friends list')


@step("I should see my username")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I should see my username')


@step("I should see the game selection")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I should see the game selection')


@step("I should see the leaderboard")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I should see the leaderboard')


@when("I fill in the wrong credentials")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I fill in the wrong credentials')


@then('I should see the error message "The username and password don\'t match" beneath the input fields')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(
        u'STEP: Then I should see the error message "The username and password don\'t match" beneath the input fields')