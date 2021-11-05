from behave import *

use_step_matcher("re")


@step("The user is visiting the home page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when("I click the tab (?P<tab>.+) above the leaderboard")
def step_impl(context, tab):
    """
    :type context: behave.runner.Context
    :type tab: str
    """
    assert True


@then("I should see the user (?P<name>.+)")
def step_impl(context, name):
    """
    :type context: behave.runner.Context
    :type name: str
    """
    assert True