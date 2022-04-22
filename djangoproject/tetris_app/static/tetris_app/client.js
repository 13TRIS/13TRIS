var INVITED_TO = null;

window.addEventListener("DOMContentLoaded", () => {
    const websocket = new WebSocket("ws://localhost:8001");
    const lobby_id = new URLSearchParams(window.location.search).get("lobby");
    let modal = new bootstrap.Modal(document.querySelector("#invitation-modal"));
    init(websocket, lobby_id);
    sendInvite(websocket, lobby_id);
    acceptInvite(websocket, modal, lobby_id);
    receive(websocket, modal, lobby_id);
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

function receive(websocket, modal, lobby_id) {
    websocket.addEventListener("message", ({data}) => {
        console.log(data);
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
                let lobbyRequest = {
                    "type": "request",
                    "lobby": lobby_id
                }
                websocket.send(JSON.stringify(lobbyRequest));
                break;
            case "init":
                window.location.replace(window.location.href.split("?")[0] + "?lobby=" + event.lobby_id);
                break;
            case "lobby-info":
                updateUI(event.lobby, event.admin);
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

function updateUI(lobby, admin) {
    let playerDisplay = document.getElementById("invited-players");
    playerDisplay.innerHTML = "";
    if (lobby.length > 1 && document.getElementById("start-btn").hasAttribute("hidden") && user === admin)
        document.getElementById("start-btn").removeAttribute("hidden");

    for (let i = 0; i < lobby.length; i++) {
        if (admin !== lobby[i]) {
            createCard(lobby[i]);
        } else {
            createCard(lobby[i], "border-danger");
        }
    }
}

function createCard(playerName, backgroundColor) {
    let innerHTML = ` <div class='card mb-3 ${backgroundColor}'>` +
        "                            <div class='row g-0'>" +
        "                                <div class='col-md-2'>" +
        "                                    <img src='user-logo.png'" +
        "                                         class='img-fluid rounded-start'" +
        "                                         alt='user logo'></div>" +
        "                                <div class='col-md-8'>" +
        "                                    <div class='card-body'>" +
        `                                       <h5 class='card-title'>${playerName}</h5>` +
        "                                        <p class='card-text'>Status: In Lobby</p>" +
        "                                        <a href=''>" +
        "                                            <button type='button' class='btn btn-danger'>Kick from Lobby</button>" +
        "                                        </a>" +
        "                                    </div>" +
        "                                </div>" +
        "                            </div>" +
        "                        </div>";
    let playerDisplay = document.getElementById("invited-players");
    let col = document.createElement("div");
    col.classList.add("col");
    col.innerHTML = innerHTML;
    playerDisplay.appendChild(col);
}