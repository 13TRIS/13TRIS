from behave import *

use_step_matcher("re")


@when("The game board is initialized")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When The game board is initialized')


@then("It should render properly with the correct resolution")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then It should render properly with the correct resolution')


@when("The player hits keyboard keys")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When The player hits keyboard keys')


@then("The engine should perceive them")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then The engine should perceive them')


@step("Perform actions accordingly")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And Perform actions accordingly')