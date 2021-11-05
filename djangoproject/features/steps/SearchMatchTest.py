from behave import *

use_step_matcher("re")


@given("The user is on the home page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("The user is not currently in a game")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when('I click the "1vs1" card')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@then('I am marked as "searching"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("I should see a visual representation of being in queue")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@then("A new lobby will be created")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step('My status will change to "playing"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@given("The following game modes")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when("I click the game mode card")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when('I click the "Solo game" card')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when('I click the "AI game" card')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True
