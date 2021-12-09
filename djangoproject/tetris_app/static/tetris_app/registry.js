$(document).ready(function () {
    const username = $('#id_username');
    const user_error = $('#user-error');
    const user_pattern = $('#user_pattern');
    const password1 = $('#id_password1');
    const password2 = $('#id_password2');
    const password_error = $('#password-error');
    const password_confirmation_error = $('#confirm-password-error');

    function checkUsername() {
        const pattern = /^[a-z0-9_-]{3,}$/;
        return pattern.test(username.val());
    }

    function checkPassword() {
        const pattern = /^[a-zA-Z](?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{7,}$/;
        return pattern.test(password1.val());
    }

    function checkPasswordMatch() {
        return password2.val() !== password1.val();
    }

    username.keyup(function () {
        if (checkUsername()) {
            user_error.removeClass('error').addClass('d-none');
            user_pattern.removeClass('error').addClass('d-none');

            $.ajax({
                data: $(this).serialize(), // get the form data
                url: validate_username,
                // on success
                success: function (response) {
                    if (response.is_taken === true) {
                        username.removeClass('is-valid').addClass('is-invalid');
                        user_error.addClass('error').removeClass('d-none');
                    } else {
                        username.removeClass('is-invalid').addClass('is-valid');
                        user_error.removeClass('error').addClass('d-none');
                    }

                },
                // on error
                error: function (response) {
                    // alert the error if any error occurred
                    console.log(response.responseJSON.errors)
                    alert('A network error has occured. Please excuse us, while we fix this error!')
                }
            })
        } else {
            user_error.removeClass('error').addClass('d-none');
            user_pattern.addClass('error').removeClass('d-none');
        }
        return false;
    });

    password1.keyup(function () {
        if (checkPassword()) {
            password_error.removeClass('error').addClass('d-none');
        } else {
            password_error.addClass('error').removeClass('d-none');
        }
        return false;
    });

    password2.keyup(function () {
        if (checkPasswordMatch()) {
            password_confirmation_error.addClass('error').removeClass('d-none');
        } else {
            password_confirmation_error.removeClass('error').addClass('d-none');
        }
        return false;
    });

    $('register_form').submit(() => {
        return (checkUsername() && checkPassword() && checkPasswordMatch())
    })
})