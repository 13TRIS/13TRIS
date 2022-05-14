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
            case "start":
                // render the boards for all players
                createBoard(websocket, lobby_id);
                break;
            case "game-info":
                updateScore(event.player, event.score);
                updatePlayerState(event.player, event.status);
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
    let innerHTML = ` <div class='card mb-3 ${backgroundColor} player-card' id='player-card-${playerName}' style="width: 500px; height: 150px;">` +
        "                            <div class='row g-0'>" +
        "                                <div class='col-md-2'>" +
        "                                    <img src='user-logo.png'" +
        "                                         class='img-fluid rounded-start'" +
        "                                         alt='user logo'></div>" +
        "                                <div class='col-md-8'>" +
        "                                    <div class='card-body'>" +
        `                                       <h5 class='card-title'>${playerName}</h5>` +
        "                                        <p class='card-text'>Status: In Lobby" +
        `<br><span id="score-${playerName}" class="score-label" hidden>Score: 0</span></p>` +
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

// send start event that gets broadcast to all websocket connections in the lobby
function startGame(websocket, lobbyID) {
    document.getElementById("start-btn").addEventListener("click", () => {
        websocket.send(JSON.stringify({"type": "start", "user": user, "lobby": lobbyID}));
    });
}

function createBoard(websocket, lobbyID) {
    let canvasEngineScript = document.createElement("script");
    canvasEngineScript.setAttribute("src", "/static/js/canvas_engine.js");
    document.getElementsByTagName("body")[0].appendChild(canvasEngineScript);
    let content = "<canvas id=\"my_canvas\" width=\"1000px\" height=\"1000px\" />"
    document.getElementById("content").innerHTML += content;
    document.getElementById("start-btn").setAttribute("hidden", "true");
    toggleKickButtons();
    toggleScoreLabels();
    changeCardColors();
    const interval = setInterval(() => {
        const gameInfo = {
            "type": "game-info",
            "player": user,
            "lobby": lobbyID,
            "status": game.status,
            "score": game.score,
        }
        websocket.send(JSON.stringify(gameInfo));
        if (game.status === "Game over") {
            clearInterval(interval);
        }
    }, Math.random() * 1000);
}

function toggleKickButtons() {
    let kickButtons = document.querySelectorAll("[data-kick]");
    for (let i = 0; i < kickButtons.length; i++) {
        kickButtons[i].toggleAttribute("hidden", true);
    }
}

function toggleScoreLabels() {
    let labels = document.getElementsByClassName("score-label");
    for (let i = 0; i < labels.length; i++) {
        labels[i].toggleAttribute("hidden");
    }
}

function updateScore(playerName, score) {
    let label = document.getElementById(`score-${playerName}`);
    label.textContent = `Score: ${score}`;
}

function changeCardColors() {
    let playerCards = document.getElementsByClassName("player-card");
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].setAttribute("class", "card mb-3 border-success player-card");
    }
}

function updatePlayerState(playerName, status) {
    if (status === "Game over") {
        document.getElementById(`player-card-${playerName}`).setAttribute("class", "card mb-3 border-danger player-card");
    }
}