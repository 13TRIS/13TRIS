from behave import *

use_step_matcher("re")


@step("The user is visiting the home page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And The user is visiting the home page')


@when("I click the tab (?P<tab>.+) above the leaderboard")
def step_impl(context, tab):
    """
    :type context: behave.runner.Context
    :type tab: str
    """
    raise NotImplementedError(u'STEP: When I click the tab <tab> above the leaderboard')


@then("I should see the user (?P<name>.+)")
def step_impl(context, name):
    """
    :type context: behave.runner.Context
    :type name: str
    """
    raise NotImplementedError(u'STEP: Then I should see the user <name>')