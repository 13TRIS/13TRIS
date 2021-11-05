from behave import *

use_step_matcher("re")


@given("The user is logged in")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given The user is logged in')


@step('The user selected game card "solo game"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And The user selected game card "solo game"')


@given("The lobby was created")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given The lobby was created')


@when("I am redirected to the game page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I am redirected to the game page')


@then('My status should be updated to "playing"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then My status should be updated to "playing"')


@step("I should see the game board")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I should see the game board')


@step("I should be able to make inputs")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I should be able to make inputs')