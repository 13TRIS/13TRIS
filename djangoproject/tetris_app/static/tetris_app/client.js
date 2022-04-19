var INVITED_TO = null;

window.addEventListener("DOMContentLoaded", () => {
    const websocket = new WebSocket("ws://localhost:8001");
    const lobby_id = new URLSearchParams(window.location.search).get("lobby");
    let modal = new bootstrap.Modal(document.querySelector("#invitation-modal"));
    init(websocket, lobby_id);
    sendInvite(websocket, lobby_id);
    acceptInvite(websocket, modal, lobby_id);
    receive(websocket, modal);
});

function acceptInvite(websocket, modal, lobby_id) {
    document.getElementById("invitation-accept").addEventListener("click", () => {
        let leaveEvent = {
            "type": "leave",
            "lobby": lobby_id,
            "user": user,
        }
        let joinEvent = {
            "type": "join",
            "user": user,
            "lobby": INVITED_TO,
        }
        modal.hide();
        websocket.send(JSON.stringify(leaveEvent));
        websocket.send(JSON.stringify(joinEvent));
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + INVITED_TO);
    });
}

function sendInvite(websocket, lobby_id) {
    document.querySelectorAll(".invite").forEach(item => {
        item.addEventListener("click", () => {
            let invite = {
                "type": "invite",
                "lobby": lobby_id,
                "to": item.id,
                "from": user,
            }
            websocket.send(JSON.stringify(invite));
        });
    });
}

function receive(websocket, modal) {
    websocket.addEventListener("message", ({data}) => {
        const event = JSON.parse(data);
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
                break;
            case "init":
                window.location.replace(window.location.href.split("?")[0] + "?lobby=" + event.lobby_id);
                break;
            case "lobby-info":
                updateUI(event.lobby);
        }
    });
}

function init(websocket, lobby_id) {
    let init = {
        "type": "init",
        "user": user
    }
    let updateConnection = {
        "type": "update",
        "user": user
    }
    let lobbyRequest = {
        "type": "request",
        "lobby": lobby_id
    }
    websocket.addEventListener("open", () => {
        if (!lobby_id) {
            websocket.send(JSON.stringify(init));
        } else {
            websocket.send(JSON.stringify(updateConnection));
            websocket.send(JSON.stringify(lobbyRequest));
        }
    });
}

function updateUI(lobby) {
    if (lobby.length > 1 && document.getElementById("start-btn").hasAttribute("hidden"))
        document.getElementById("start-btn").removeAttribute("hidden");

    for (let member in lobby) {
        if (user !== member) {
            createCard(member);
        }
    }
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