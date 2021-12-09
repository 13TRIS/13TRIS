$(document).ready(function () {
    const username = $('#fieldUserName');
    const user_error = $('#user-error');
    let allowSubmit = false;
    let timeout = null;


    username.keyup(() => {
        clearTimeout(timeout);

        const ajaxFn = () => {
            $.ajax({
                data: $(username).serialize(),
                url: validate_username,
                success: (response) => {
                    if (response.is_taken === true) {
                        username.removeClass('is-valid').addClass('is-invalid');
                        user_error.addClass('error').removeClass('d-none');
                        allowSubmit = false;
                    } else {
                        username.removeClass('is-invalid').addClass('is-valid');
                        user_error.removeClass('error').addClass('d-none');
                        allowSubmit = true;
                    }
                },
                error: (response) => {
                    alert('A network error has occured. Please excuse us, while we fix this error!');
                }
            })
        };
        timeout = setTimeout(ajaxFn, 1000);

        return false;
    });

    $('login_form').submit(() => {
        return allowSubmit;
    })
})