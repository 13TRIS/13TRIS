var INVITED_TO = null;

window.addEventListener("DOMContentLoaded", () => {
    const websocket = new WebSocket("ws://localhost:8001");
    let modal = new bootstrap.Modal(document.querySelector("#invitation-modal"));
    init(websocket);
    // close(websocket);
    sendInvite(websocket);
    acceptInvite(websocket, modal);
    receive(websocket, modal);
});

function acceptInvite(websocket, modal) {
    document.getElementById("invitation-accept").addEventListener("click", () => {
        let leaveEvent = {
            "type": "leave",
            "lobby": lobby_id,
        }
        modal.hide();
        websocket.send(JSON.stringify(leaveEvent));
        window.location.replace(window.location.href + "?lobby=" + INVITED_TO);
    });
}

function sendInvite(websocket) {
    document.querySelectorAll(".invite").forEach(item => {
        item.addEventListener("click", () => {
            let event = {
                "type": "invite",
                "lobby": lobby_id,
                "to": item.id,
                "from": user,
            }
            websocket.send(JSON.stringify(event));
        });
    });
}

function receive(websocket, modal) {
    websocket.addEventListener("message", ({data}) => {
        const event = JSON.parse(data);
        console.log(event);
        switch (event.type) {
            case "invite":
                if (user === event.to) {
                    let text = "Do you want to accept the invitation from " + event.from + " and join the lobby " +
                        event.lobby + "?";
                    document.querySelector("#modal-text-content").textContent = text;
                    modal.show();
                    INVITED_TO = event.lobby;
                }
                break;
            case "join":
                createCard(event.user);
                document.getElementById("start-btn").removeAttribute("hidden");
                break;
        }
    });
}

function init(websocket) {
    let event = {
        "type": "init",
        "user": user,
        "lobby": lobby_id,
        "sessionId": session,
    }
    let joinEvent = {
        "type": "join",
        "lobby": new URLSearchParams(window.location.search).get("lobby"),
        "user": user,
        "sessionId": session
    }
    websocket.addEventListener("open", () => {
        if (!new URLSearchParams(window.location.search).get("lobby"))
            websocket.send(JSON.stringify(event));
        else
            websocket.send(JSON.stringify(joinEvent));
    });
}

function createCard(playerName) {
    let innerHTML = " <div class=\"col-md-2\">\n" +
        "                                    <img src=\"user_icon_128px.png\"\n" +
        "                                         class=\"img-fluid rounded-start\"\n" +
        "                                         alt=\"user logo\"></div>\n" +
        "                                <div class=\"col-md-8\">\n" +
        "                                    <div class=\"card-body\">\n" +
        `                                       <h5 class=\"card-title\">${playerName}</h5>\n` +
        "                                        <p class=\"card-text\">Status: In Lobby</p>\n" +
        "                                        <a href=\"{% url 'update_friend' operation='remove' username=friend.username %}\">\n" +
        "                                            <button type=\"button\" class=\"btn btn-danger\">Kick from Lobby</button>\n" +
        "                                        </a>\n" +
        "                                    </div>"
    let playerDisplay = document.getElementById("invited-players");
    let col = document.createElement("div");
    col.classList.add("col");
    let card = document.createElement("div");
    card.classList.add("card", "mb-3");
    let row = document.createElement("div");
    row.classList.add("row", "g-0");
    row.innerHTML = innerHTML;
    card.appendChild(row);
    col.appendChild(card);
    playerDisplay.appendChild(col);
}

function close(websocket) {
    let event = {
        "type": "leave",
        "lobby": lobby_id,
    }
    window.onbeforeunload = () => {
        websocket.send(JSON.stringify(event));
    }
}