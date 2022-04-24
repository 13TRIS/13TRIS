const form = document.getElementsByTagName('form')[0];
/* Inputs */
const usernameInput = document.getElementById('fieldUserName');
const fieldPassword = document.getElementById('fieldPassword');
const fieldConfirmPassword = document.getElementById('fieldConfirmPassword');
/* Errors */
const userError = document.getElementById('user-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const registrationError = document.getElementById('registration-error');

/* Handle issues with username */
usernameInput.addEventListener('input', function (event) {
    if (usernameInput.validity.patternMismatch) {
        userError.setAttribute('class', 'error');
        userError.textContent = 'The username must only consist of letters and numerals, ' +
            'start with a letter and be at least 5 characters long!';
    } else {
        userError.removeAttribute('class');
        userError.textContent = '';
    }
});

/* Handle issues with password */
fieldPassword.addEventListener('input', function (event) {
    checkConfirmPassword();
    if (fieldPassword.validity.patternMismatch) {
        passwordError.setAttribute('class', 'error');
        passwordError.innerHTML = 'Password must contain the following: <ul><li>A lowercase letter</li>' +
            '<li>A capital letter</li><li>A number</li><li>A special character</li><li>Minimum 8 characters</li></ul>';
    } else {
        passwordError.removeAttribute('class');
        passwordError.textContent = '';
    }
});

/* Handle issues with password confirmation */
fieldConfirmPassword.addEventListener('input', checkConfirmPassword);

function checkConfirmPassword() {
    if (!isConfirmPasswordValid()) {
        confirmPasswordError.setAttribute('class', 'error');
        confirmPasswordError.textContent = 'Passwords do not match!';
    } else {
        confirmPasswordError.removeAttribute('class');
        confirmPasswordError.textContent = '';
    }
}

function isConfirmPasswordValid() {
    if (fieldPassword.value !== fieldConfirmPassword.value) {
        return false;
    } else {
        return true;
    }
}

/* Prevent form submission if any input has wrong values */
form.addEventListener('submit', function (event) {
    if (usernameInput.validity.patternMismatch) {
        event.preventDefault();
    } else if (!isConfirmPasswordValid()) {
        event.preventDefault();
    } else if (!usernameInput.value || !fieldPassword.value || !fieldConfirmPassword.value) {
        registrationError.setAttribute('class', 'error');
        registrationError.textContent = 'You have to fill out the form!';
        event.preventDefault();
    }
});