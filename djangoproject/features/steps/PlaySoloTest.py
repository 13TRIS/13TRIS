from behave import *

use_step_matcher("re")


@given("The user is logged in")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step('The user selected game card "solo game"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@given("The lobby was created")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when("I am redirected to the game page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@then('My status should be updated to "playing"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("I should see the game board")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("I should be able to make inputs")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True