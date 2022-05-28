// Stores all possible events that a client can send to the websocket server.
const ClientEvents = (function () {
    /***
     * Event that is sent to the server to generate a lobby for the sender.
     * @param {string} user
     * @returns {{type: string, user: string}}
     */
    const initEvent = function (user) {
        return {
            "type": "init",
            "user": user,
        }
    }
    /***
     * Event that is sent to notify another user that he should join the lobby.
     * @param {string} lobbyId
     * @param {string} to
     * @param {string} user
     * @returns {{lobby: string, from: string, to: string, type: string}}
     */
    const inviteEvent = function (lobbyId, to, user) {
        return {
            "type": "invite",
            "lobby": lobbyId,
            "to": to,
            "from": user,
        }
    }
    /***
     * Event that is sent from someone who was invited into a lobby and wants to join this lobby.
     * @param {string} invitedTo
     * @param {string} user
     * @returns {{lobby: string, type: string, user: string}}
     */
    const joinEvent = function (invitedTo, user) {
        return {
            "type": "join",
            "user": user,
            "lobby": invitedTo,
        }
    }
    /***
     * Event that is sent to the server to remove the user from a lobby.<br>
     * If 'isInstant'=true he will immediately be removed.<br>
     * If 'isInstant'=false the server will start a thread that checks if an 'updateConnectionEvent' is sent from
     * the client afterwards. If so he will not be removed.<br>
     * If 'isKick'=true a new lobby will be created for user 'userName'.
     * @param {string} lobbyId
     * @param {string} userName
     * @param {boolean} isInstant
     * @param {boolean} isKick
     * @returns {{lobby: string, kick: boolean, type: string, user: string, instant: boolean}}
     */
    const leaveEvent = function (lobbyId, userName, isInstant, isKick) {
        return {
            "type": "leave",
            "lobby": lobbyId,
            "user": userName,
            "instant": isInstant,
            "kick": isKick,
        }
    }
    /***
     * Tells the server to update the connection for the given 'user'.
     * @param {string} user
     * @returns {{type: string, user: string}}
     */
    const updateConnectionEvent = function (user) {
        return {
            "type": "update",
            "user": user,
        }
    }
    /***
     * Requests information about the lobby 'lobbyId' from the server.
     * @param {string} lobbyId
     * @returns {{lobby: string, type: string}}
     */
    const lobbyRequestEvent = function (lobbyId) {
        return {
            "type": "request",
            "lobby": lobbyId,
        }
    }

    return {
        initEvent: initEvent,
        inviteEvent: inviteEvent,
        joinEvent: joinEvent,
        leaveEvent: leaveEvent,
        updateConnectionEvent: updateConnectionEvent,
        lobbyRequestEvent: lobbyRequestEvent,
    }
})();

// Represents a client who can communicate with a websocket server.
const Client = (function () {
    let invitedTo = null;

    /***
     * Sends an 'ClientEvents.initEvent' to the server at the specified 'websocket' connection.
     * @param {WebSocket} websocket
     * @param {string} user
     */
    const sendInitEvent = function (websocket, user) {
        websocket.send(JSON.stringify(ClientEvents.initEvent(user)));
    }
    /***
     * Sends an 'ClientEvents.inviteEvent' to the server.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     * @param {string} to
     * @param {string} user
     */
    const sendInviteEvent = function (websocket, lobbyId, to, user) {
        websocket.send(JSON.stringify(ClientEvents.inviteEvent(lobbyId, to, user)));
    }
    /***
     * Lets 'user' join the lobby 'invitedTo'.
     * @param {WebSocket} websocket
     * @param {string} invitedTo
     * @param {string} user
     */
    const sendJoinEvent = function (websocket, invitedTo, user) {
        websocket.send(JSON.stringify(ClientEvents.joinEvent(invitedTo, user)));
    }
    /***
     * Sends a 'ClientEvents.leaveEvent' to the server with the given arguments.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     * @param {string} userName
     * @param {boolean} isInstant
     * @param {boolean} isKick
     */
    const sendLeaveEvent = function (websocket, lobbyId, userName, isInstant, isKick) {
        websocket.send(JSON.stringify(ClientEvents.leaveEvent(lobbyId, userName, isInstant, isKick)));
    }
    /***
     * Updates the connection that the server stores for this client so they can still communicate.
     * @param {WebSocket} websocket
     * @param {string} user
     */
    const sendUpdateConnectionEvent = function (websocket, user) {
        websocket.send(JSON.stringify(ClientEvents.updateConnectionEvent(user)));
    }
    /***
     * Requests the server to send back information about the given lobby.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const sendLobbyRequestEvent = function (websocket, lobbyId) {
        websocket.send(JSON.stringify(ClientEvents.lobbyRequestEvent(lobbyId)));
    }

    /***
     * Receive an event of type 'init'.
     * @param {{type: string, lobby_id: string}} data
     */
    const receiveInit = function (data) {
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + data["lobby_id"]);
    }
    /***
     * Receive an event of type 'invite'.<br>
     * If the receiving user is the intended user a modal will be shown asking if he accepts the invitation.
     * @param {{type: string, lobby: string, to: string, from: string}} data
     */
    const receiveInvite = function (data) {
        if (user === data["to"]) {
            let text = `Do you want to accept the invitation from ${data["from"]} and join the lobby ${data["lobby"]}?`
            UI.showInvitationModal(text);
            invitedTo = data["lobby"];
        }
    }
    /***
     * Receive an event of type 'join'.<br>
     * Information about the lobby is requested from the server in order to update the UI correctly.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const receiveJoin = function (websocket, lobbyId) {
        Client.sendLobbyRequestEvent(websocket, lobbyId);
    }
    /***
     * Receive an event of type 'lobby-info'.
     * @param {{type: string, lobby: string[], admin: string}} data
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const receiveLobbyInfo = function (data, websocket, lobbyId) {
        UI.createPlayerCards(data["lobby"], data["admin"]);
        registerKickBtnListeners(websocket, lobbyId);
    }
    // Receive an event of type 'kick'.
    const receiveKickEvent = function () {
        // TODO
    }
    // Receive an event of type 'start'.
    const receiveStart = function () {
        // TODO
    }

    /***
     * Registers a 'ListenerRegistry.kickFromLobbyBtnListener' listener on each kick button.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    function registerKickBtnListeners(websocket, lobbyId) {
        let kickButtons = document.querySelectorAll("button[data-kick]");
        for (let i = 0; i < kickButtons.length; i++) {
            kickButtons[i].addEventListener("click", function () {
                let userName = kickButtons[i].getAttribute("id").split("-")[1];
                ListenerRegistry.kickFromLobbyBtnListener(websocket, lobbyId, userName);
            });
        }
    }

    return {
        sendInitEvent: sendInitEvent,
        sendInviteEvent: sendInviteEvent,
        sendJoinEvent: sendJoinEvent,
        sendLeaveEvent: sendLeaveEvent,
        sendUpdateConnectionEvent: sendUpdateConnectionEvent,
        sendLobbyRequestEvent: sendLobbyRequestEvent,
        receiveInit: receiveInit,
        receiveInvite: receiveInvite,
        receiveJoin: receiveJoin,
        receiveLobbyInfo: receiveLobbyInfo,
        receiveKickEvent: receiveKickEvent,
        receiveStart: receiveStart,
        invitedTo: invitedTo,
    }
})();

// Represents the UI of the client and provides methods to update certain parts of the UI.
const UI = (function () {
    const invitationModal = new bootstrap.Modal(document.querySelector("#invitation-modal"));

    /***
     * Shows the modal which is intended for invitations with the specified text.
     * @param {string} text
     */
    const showInvitationModal = function (text) {
        document.querySelector("#modal-text-content").textContent = text;
        invitationModal.show();
    }
    /***
     * Create cards for all players currently in the lobby.
     * @param {string[]} lobby
     * @param {string} admin
     */
    const createPlayerCards = function (lobby, admin) {
        let playerDisplay = document.getElementById("invited-players");
        playerDisplay.innerHTML = "";
        for (let i = 0; i < lobby.length; i++) {
            if (admin !== lobby[i]) {
                createCard(lobby[i], "border-dark", true, playerDisplay);
            } else {
                createCard(lobby[i], "border-danger", false, playerDisplay);
            }
        }
    }

    /***
     * Creates a card for a specific player with a specific border color.
     * @param {string} playerName
     * @param {string} borderColor
     * @param {boolean} addKickBtn
     * @param {HTMLElement} playerDisplay
     */
    function createCard(playerName, borderColor, addKickBtn, playerDisplay) {
        let kickFromLobbyBtn = `<button type="button" class="btn btn-danger" data-kick id="kick-${playerName}">`
            + `Kick from Lobby</button>`;
        let playerCard = `<div class="card mb-3 ${borderColor} player-card" id="player-card-${playerName}"`
            + ` style="width: 250px; height: 150px;"><div class="row g-0"><div class="col-md-2"><img src="user-logo.png"`
            + ` class="img-fluid rounded-start" alt="user logo"></div><div class="col-md-8"><div class="card-body">`
            + `<h5 class="card-title">${playerName}</h5><p class="card-text">Status: In Lobby<br><span`
            + ` id="score-${playerName}" class="score-label" hidden>Score: 0</span></p>${addKickBtn ? kickFromLobbyBtn : ""}`
            + `</div></div></div></div>`;
        let col = document.createElement("div");
        col.classList.add("col");
        col.innerHTML = playerCard;
        playerDisplay.appendChild(col);
    }

    return {
        showInvitationModal: showInvitationModal,
        createPlayerCards: createPlayerCards,
    }
})();

// Stores all listeners that should be registered.
const ListenerRegistry = (function () {
    /***
     * Listens for incoming messages on the websocket connection.
     * @param {MessageEvent} event
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const messageListener = function (event, websocket, lobbyId) {
        const data = JSON.parse(event);
        switch (data["type"]) {
            case "init":
                Client.receiveInit(data);
                break;
            case "invite":
                Client.receiveInvite(data);
                break;
            case "join":
                Client.receiveJoin(websocket, lobbyId);
                break;
            case "lobby-info":
                Client.receiveLobbyInfo(data, websocket, lobbyId);
                break;
            case "kick":
                Client.receiveKickEvent();
                break;
            case "start":
                Client.receiveStart();
                break;
        }
    }
    /***
     * Listens for a kick button being pressed on a player card.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     * @param {string} userName
     */
    const kickFromLobbyBtnListener = function (websocket, lobbyId, userName) {
        Client.sendLeaveEvent(websocket, lobbyId, userName, true, true);
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + lobbyId);
    }
    /***
     * Listens for a websocket connection to open.
     * @param {WebSocket} websocket
     * @param {string | null} lobbyId
     */
    const openConnectionListener = function (websocket, lobbyId) {
        if (lobbyId == null) {
            Client.sendInitEvent(websocket, user);
        } else {
            Client.invitedTo = null;
            Client.sendUpdateConnectionEvent(websocket, user);
            Client.sendLobbyRequestEvent(websocket, lobbyId);
        }
    }
    /**
     * Listens for the page to be reloaded.
     * @param {WebSocket} websocket
     * @param {string | null} lobbyId
     */
    const beforeunloadListener = function (websocket, lobbyId) {
        if (Client.invitedTo == null && lobbyId != null) {
            Client.sendLeaveEvent(websocket, lobbyId, user, false, false);
        }
    }

    return {
        messageListener: messageListener,
        kickFromLobbyBtnListener: kickFromLobbyBtnListener,
        openConnectionListener: openConnectionListener,
        beforeunloadListener: beforeunloadListener,
    }
})();

// "Entry point" for this file
window.addEventListener("DOMContentLoaded", function () {
    const websocket = new WebSocket("ws://localhost:8001");
    const lobbyId = new URLSearchParams(window.location.search).get("lobby");
    window.addEventListener("beforeunload", function () {
       ListenerRegistry.beforeunloadListener(websocket, lobbyId);
    });
    websocket.addEventListener("open", function () {
       ListenerRegistry.openConnectionListener(websocket, lobbyId);
    });
    websocket.addEventListener("message", function (event) {
        ListenerRegistry.messageListener(event, websocket, lobbyId);
    });
});


//****************************
//old
//****************************


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

function sleep(seconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < seconds * 1000);
}

// send start event that gets broadcast to all websocket connections in the lobby
function sendStartEvent(websocket, lobbyID) {
    document.getElementById("start-btn").addEventListener("click", () => {
        websocket.send(JSON.stringify({"type": "start", "user": user, "lobby": lobbyID}));
    });
}

function createBoard(websocket, lobbyID) {
    // 1. add canvas
    let content = "<canvas id=\"my_canvas\" width=\"1000px\" height=\"1000px\" />"
    document.getElementById("content").innerHTML += content;

    // 2. load game engine script
    let canvasEngineScript = document.createElement("script");
    canvasEngineScript.setAttribute("src", "/static/js/canvas_engine.js");
    canvasEngineScript.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(canvasEngineScript);

    // 3. invoke start game function
    canvasEngineScript.onload = () => {
        startGame();
    }

    // 4. other changes to the UI
    document.getElementById("start-btn").setAttribute("hidden", "true");
    toggleKickButtons();
    toggleScoreLabels();
    changeCardColors();

    // 5. start sending state
    const interval = setInterval(() => {
        const gameInfo = {
            "type": "game-info",
            "player": user,
            "lobby": lobbyID,
            "status": game.status,
            "score": game.score,
        }
        //websocket.send(JSON.stringify(gameInfo));
        if (game.status === "Game over") {
            clearInterval(interval);
        }
    }, Math.random() * 2000);
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