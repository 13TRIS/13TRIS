from behave import *

use_step_matcher("re")


@given("The user visited the registration page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@given("The username is not in use")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step("The password meets the specified requirements")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@when("I enter my desired username and password")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step('I click the "Register" button')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@then("I should be redirected to the login page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@step('I should see the message "Account has been successfully created!" beneath the input fields')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@given("The username is already in use")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    assert True


@given("The password does not meet the requirements")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given The password does not meet the requirements')


@then('I should see the message "Username already exists" beneath the input fields')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Then I should see the message "Username already exists" beneath the input fields')


@then('I should see the message "Password does not meet the requirements" beneath the input fields')
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(
        u'STEP: Then I should see the message "Password does not meet the requirements" beneath the input fields')