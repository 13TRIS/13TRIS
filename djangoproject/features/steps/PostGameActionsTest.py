from behave import *

use_step_matcher("re")


@when("The match is completed")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@then("A new database entry should be saved")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("The fields should contain the correct usernames and date")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step('My state "playing" should be removed')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("I am redirected to the end screen page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True