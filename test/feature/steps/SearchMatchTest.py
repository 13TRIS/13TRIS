from behave import *

use_step_matcher("re")


@given("The user is on the home page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given The user is on the home page')


@step("The user is not currently in a game")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And The user is not currently in a game')


@when('I click the "1vs1" card')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I click the "1vs1" card')


@then('I am marked as "searching"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then I am marked as "searching"')


@step("I should see a visual representation of being in queue")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I should see a visual representation of being in queue')


@then("A new lobby will be created")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then A new lobby will be created')


@step('My status will change to "playing"')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And My status will change to "playing"')


@given("The following game modes")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given The following game modes
                              | solo |
                              | ai | ')


@when("I click the game mode card")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I click the game mode card')


@when('I click the "Solo game" card')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I click the "Solo game" card')


@when('I click the "AI game" card')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I click the "AI game" card')


@when("I click the game mode card")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When I click the game mode card')