from behave import *

use_step_matcher("re")


@step('The user selected the game card "1vs1"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@given('I have the status "searching"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when("I am matched against another player")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("I am redirected to the game page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True