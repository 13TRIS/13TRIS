from behave import *

use_step_matcher("re")


@when("The match is completed")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: When The match is completed')


@then("A new database entry should be saved")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then A new database entry should be saved')


@step("The fields should contain the correct usernames and date")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And The fields should contain the correct usernames and date')


@step('My state "playing" should be removed')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And My state "playing" should be removed')


@step("I am redirected to the end screen page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: And I am redirected to the end screen page')