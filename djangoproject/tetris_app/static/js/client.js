var INVITED_TO = null;

window.addEventListener("DOMContentLoaded", () => {
    const lobby_id = new URLSearchParams(window.location.search).get("lobby");
    const websocket = new WebSocket("ws://localhost:8001");
    let modal = new bootstrap.Modal(document.querySelector("#invitation-modal"));
    init(websocket, lobby_id);
    sendInvite(websocket, lobby_id);
    acceptInvite(websocket, modal, lobby_id);
    receive(websocket, modal, lobby_id);
    beforeUnload(websocket, lobby_id);
    startGame(websocket, lobby_id);
});

function beforeUnload(websocket, lobby_id) {
    if (!lobby_id)
        return;
    window.addEventListener("beforeunload", () => {
        if (INVITED_TO == null) {
            leaveLobby(websocket, lobby_id, false, null, false);
        }
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
        websocket.send(JSON.stringify(joinEvent));
        leaveLobby(websocket, lobby_id, true, null, false);
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + INVITED_TO);
    });
}

function leaveLobby(websocket, lobby_id, isInstant, userName, isKick) {
    let leaveEvent = {
        "type": "leave",
        "lobby": lobby_id,
        "user": userName ? userName : user,
        "instant": isInstant,
        "kick": isKick
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
        console.log(data);
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
                registerListeners(websocket, lobby_id);
                break;
            case "kick":
                let kickModal = new bootstrap.Modal(document.getElementById("kick-modal"));
                kickModalEvent(websocket);
                kickModal.show();
                break;
            case "move": // TODO
                // draw board of user event.user
                break;
            default:
                break;
        }
    });
}

function kickModalEvent(websocket) {
    document.getElementById("kick-modal").addEventListener("shown.bs.modal", () => {
        sleep(5);
        websocket.send(JSON.stringify({"type": "init", "user": user}));
    });
}

function registerListeners(websocket, lobby_id) {
    let elements = document.querySelectorAll("button[data-kick]")
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", () => {
            leaveLobby(websocket, lobby_id, true,
                elements[i].getAttribute("id").split("-")[1], true);
            window.location.replace(window.location.href.split("?")[0] + "?lobby=" + lobby_id);
        });
    }
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
            INVITED_TO = null;
            updateConnection(websocket);
            requestLobbyInfo(websocket, lobby_id);
        }
    });
}

function updateConnection(websocket) {
    let updateConnection = {
        "type": "update",
        "user": user,
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
        kickFromLobbyBtn = `<button type='button' class='btn btn-danger' data-kick
                            id='kick-${playerName}'>Kick from Lobby</button>`;
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

function sleep(seconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < seconds * 1000);
}

function startGame(websocket, lobbyID) {
    document.getElementById("start-btn").addEventListener("click", () => {
        createBoards();
        let canvasEngineScript = document.createElement("script");
        canvasEngineScript.setAttribute("src", "/static/js/canvas_engine.js");
        document.getElementsByTagName("body")[0].appendChild(canvasEngineScript);
        const interval = setInterval(() => {
            const move = {
                "type": "move",
                "player": user,
                "lobby": lobbyID,
                "board": game.board,
            }
            websocket.send(JSON.stringify(move));
        }, 2000);
    });
}

function createBoards() { // TODO
    let content = "";
    content = "<canvas id=\"my_canvas\" class=\"tetris-board\" width=\"1000px\" height=\"1000px\" />"
    /*for (let i = 0; i < 3; i++) {
        content += `<canvas id="player${i}" class="tetris-board" width="1000px" height="1000px" />`;
    }*/
    document.getElementById("content").innerHTML = content;
}