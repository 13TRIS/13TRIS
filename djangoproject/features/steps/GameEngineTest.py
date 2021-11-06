from behave import *

use_step_matcher("re")


@when("The game board is initialized")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert False


@then("It should render properly with the correct resolution")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert False


@when("The player hits keyboard keys")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@then("The engine should perceive them")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("Perform actions accordingly")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True