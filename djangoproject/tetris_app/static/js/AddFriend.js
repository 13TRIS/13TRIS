window.addEventListener("DOMContentLoaded", () => {
    let input = document.getElementsByName("textFieldAddFriend")[0];
    input.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            addFriend();
        }
    });
    let addFriendButton = document.getElementById("button-addon1");
    addFriendButton.addEventListener("click", () => {
        addFriend();
    });
});

function addFriend() {
    // Selecting the input element and get its value
    let userName = document.querySelector('[name="textFieldAddFriend"]').value; // selected by name

    url = window.location.origin + '/connect/add/' + userName;
    window.open(url, "_self");
}