var INVITED_TO = null;

window.addEventListener("DOMContentLoaded", () => {
    const lobby_id = new URLSearchParams(window.location.search).get("lobby");
    const websocket = new WebSocket("ws://localhost:8001");
    let modal = new bootstrap.Modal(document.querySelector("#invitation-modal"));
    let leaveModal = new bootstrap.Modal(document.querySelector("#leave-modal"));
    init(websocket, lobby_id);
    sendInvite(websocket, lobby_id);
    acceptInvite(websocket, modal, lobby_id);
    receive(websocket, modal, lobby_id);
    beforeUnload(websocket, lobby_id, leaveModal);
});

function beforeUnload(websocket, lobby_id, modal) {
    if (!lobby_id)
        return;
    window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        return event.returnValue = "Do you really want to leave the lobby?";
    });
    window.addEventListener("close", () => {
       leaveLobby(websocket, lobby_id);
    });
    document.getElementById("leave-confirm").addEventListener("click", () => {
       leaveLobby(websocket, lobby_id);
       window.location.replace(window.location.href.split("?")[0]);
    });
}

function acceptInvite(websocket, modal, lobby_id) {
    document.getElementById("invitation-accept").addEventListener("click", () => {
        let joinEvent = {
            "type": "join",
            "user": user,
            "lobby": INVITED_TO,
        }
        modal.hide();
        leaveLobby(websocket, lobby_id);
        websocket.send(JSON.stringify(joinEvent));
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + INVITED_TO);
    });
}

function leaveLobby(websocket, lobby_id) {
    let leaveEvent = {
        "type": "leave",
        "lobby": lobby_id,
        "user": user,
    }
    websocket.send(JSON.stringify(leaveEvent));
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
                requestLobbyInfo(websocket, lobby_id);
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
    console.log(lobby_id);
    websocket.addEventListener("open", () => {
        if (!lobby_id) {
            websocket.send(JSON.stringify(init));
        } else {
            updateConnection(websocket);
            requestLobbyInfo(websocket, lobby_id);
        }
    });
}

function updateConnection(websocket) {
    let updateConnection = {
        "type": "update",
        "user": user
    }
    websocket.send(JSON.stringify(updateConnection));
}

function requestLobbyInfo(websocket, lobby_id) {
    let lobbyRequest = {
        "type": "request",
        "lobby": lobby_id
    }
    websocket.send(JSON.stringify(lobbyRequest));
}

function updateUI(lobby, admin) {
    let playerDisplay = document.getElementById("invited-players");
    playerDisplay.innerHTML = "";
    if (lobby.length > 1 && document.getElementById("start-btn").hasAttribute("hidden") && user === admin)
        document.getElementById("start-btn").removeAttribute("hidden");

    for (let i = 0; i < lobby.length; i++) {
        if (admin !== lobby[i]) {
            createCard(lobby[i], "", admin);
        } else {
            createCard(lobby[i], "border-danger", admin);
        }
    }
}

function createCard(playerName, backgroundColor, admin) {
    let kickFromLobbyBtn = "";
    if (user === admin && playerName !== user)
        kickFromLobbyBtn = "<button type='button' class='btn btn-danger'>Kick from Lobby</button>";
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
        `${kickFromLobbyBtn}` +
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