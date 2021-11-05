from behave import *

use_step_matcher("re")


@step('The user selected the game card "1vs1"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And The user selected the game card "1vs1"')


@given('I have the status "searching"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given I have the status "searching"')


@when("I am matched against another player")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I am matched against another player')


@step("I am redirected to the game page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I am redirected to the game page')