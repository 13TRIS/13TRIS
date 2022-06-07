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

    /***
     * Message that is used to notify the lobby that the admin started the game.
     * @param {string} user
     * @param {string} lobbyId
     */
    const startEvent = function (user, lobbyId) {
        return {
            "type": "start",
            "user": user,
            "lobby": lobbyId,
        }
    }

    /***
     * Message that is sent in intervals to the server to update the state for each player in the lobby during a game.
     * @param {string} user
     * @param {string} lobbyId
     * @param {string} status
     * @param {number} score
     */
    const gameInfoEvent = function (user, lobbyId, status, score) {
        return {
            "type": "game-info",
            "player": user,
            "lobby": lobbyId,
            "status": status,
            "score": score,
        }
    }

    return {
        initEvent: initEvent,
        inviteEvent: inviteEvent,
        joinEvent: joinEvent,
        leaveEvent: leaveEvent,
        updateConnectionEvent: updateConnectionEvent,
        lobbyRequestEvent: lobbyRequestEvent,
        startEvent: startEvent,
        gameInfoEvent: gameInfoEvent,
    }
})();

// Represents a client who can communicate with a websocket server.
const Client = (function () {
    let lastInvitedTo = null;
    let playing = false;

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
     * Sends a start event to the server that should notify all players in a lobby that the game is starting.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const sendStartEvent = function (websocket, lobbyId) {
        websocket.send(JSON.stringify(ClientEvents.startEvent(user, lobbyId)));
    }

    /***
     * Sends information about the game state of the current user to the server.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const sendGameInfo = function (websocket, lobbyId) {
        websocket.send(JSON.stringify(ClientEvents.gameInfoEvent(user, lobbyId, game.status, game.score)));
    }

    /***
     * The client will start sending info about his game state to the server repeatedly. It will stop if
     * game.status = "Game over".
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const startSendingGameInfo = function (websocket, lobbyId) {
        const interval = setInterval(function () {
            sendGameInfo(websocket, lobbyId);
            if (game.status === "Game over") {
                clearInterval(interval);
            }
        }, Math.random() * 2000);
    }

    /***
     * Receive an event of type 'init'.
     * @param {{type: string, lobby_id: string}} data
     */
    const receiveInit = function (data) {
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + data["lobby_id"] + "&playing=false");
    }

    /***
     * Receive an event of type 'invite'.<br>
     * If the receiving user is the intended user a modal will be shown asking if he accepts the invitation.
     * @param {{type: string, lobby: string, to: string, from: string}} data
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const receiveInvite = function (data, websocket, lobbyId) {
        if (user === data["to"]) {
            let text = `Do you want to accept the invitation from ${data["from"]} and join the lobby ${data["lobby"]}?`
            UI.showInvitationModal(text);
            lastInvitedTo = data["lobby"];
            UI.registerAcceptInvitationButtonListener(websocket, lobbyId);
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
        if (playing === true) {
            // TODO
            // player reloaded the page during the game
            // leave current lobby and create a new one
            Client.sendInitEvent(websocket, user);
        } else {
            UI.createPlayerCards(data["lobby"], data["admin"]);
            if (data["lobby"].length > 1 && user === data["admin"]) UI.showStartBtn();
            registerKickBtnListeners(websocket, lobbyId);
        }
    }

    /***
     * Receive an event of type 'kick'.
     * @param {WebSocket} websocket
     */
    const receiveKickEvent = function (websocket) {
        UI.registerKickModalListener(websocket);
        UI.showKickModal();
    }

    /***
     * Receive an event of type 'start'.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const receiveStart = function (websocket, lobbyId) {
        let url = window.location.href.replace("playing=false", "playing=true");
        window.history.pushState("", "13TRIS", url);
        UI.createGame(websocket, lobbyId);
    }

    /***
     * Receive an event of type 'game-info' from the server.
     * @param {{type: string, player: string, lobby: string, status: string, score: number}} data
     */
    const receiveGameInfo = function (data) {
        UI.updateScore(data["player"], data["score"]);
        UI.updatePlayerState(data["player"], data["status"]);
    }

    /***
     * Registers a 'ListenerRegistry.kickFromLobbyBtnListener' listener on each kick button.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    function registerKickBtnListeners(websocket, lobbyId) {
        let kickButtons = document.querySelectorAll("button[data-kick]");
        for (const element of kickButtons) {
            element.addEventListener("click", function () {
                let userName = element.getAttribute("id").split("-")[1];
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
        sendStartEvent: sendStartEvent,
        sendGameInfo: sendGameInfo,
        startSendingGameInfo: startSendingGameInfo,
        receiveInit: receiveInit,
        receiveInvite: receiveInvite,
        receiveJoin: receiveJoin,
        receiveLobbyInfo: receiveLobbyInfo,
        receiveKickEvent: receiveKickEvent,
        receiveStart: receiveStart,
        receiveGameInfo: receiveGameInfo,
        /***
         * Setter/getter for 'invitedTo' depending on if an argument is given or not.
         * @param {null | string=} value
         * @returns {string | null}
         */
        invitedTo: function (value) {
            if (arguments.length) {
                lastInvitedTo = value;
            }
            return lastInvitedTo;
        },
        /***
         * Setter/getter for 'playing' depending on if an argument is given or not.
         * @param {null | boolean=} value
         * @returns {boolean | null}
         */
        playing: function (value) {
            return arguments.length ? playing = value : playing;
        },
    }
})();

// Represents the UI of the client and provides methods to update certain parts of the UI.
const UI = (function () {
    const invitationModal = new bootstrap.Modal(document.querySelector("#invitation-modal"));
    const kickModal = new bootstrap.Modal(document.getElementById("kick-modal"));

    /***
     * Shows the modal which is intended for invitations with the specified text.
     * @param {string} text
     */
    const showInvitationModal = function (text) {
        document.querySelector("#modal-text-content").textContent = text;
        invitationModal.show();
    }

    /***
     * Shows the kick modal.
     */
    const showKickModal = function () {
        kickModal.show();
    }

    /***
     * Create cards for all players currently in the lobby.
     * @param {string[]} lobby
     * @param {string} admin
     */
    const createPlayerCards = function (lobby, admin) {
        let addKickBtn = user === admin;
        let playerDisplay = document.getElementById("invited-players");
        playerDisplay.innerHTML = "";
        for (const element of lobby) {
            if (admin !== element) {
                createCard(element, "border-dark", true, playerDisplay);
            } else {
                createCard(element, "border-danger", false, playerDisplay);
            }
        }
    }

    /***
     * Registers listeners to all the invitation buttons.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const registerInvitationButtonListeners = function (websocket, lobbyId) {
        document.querySelectorAll(".invite").forEach(function (item) {
            item.addEventListener("click", function () {
                ListenerRegistry.sendInvitationListener(websocket, lobbyId, item.id);
            });
        });
    }

    /***
     * Registers a listener on the invitation accept button.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const registerAcceptInvitationButtonListener = function (websocket, lobbyId) {
        document.getElementById("invitation-accept").addEventListener("click", function () {
            ListenerRegistry.acceptInvitationListener(websocket, invitationModal, lobbyId);
        });
    }

    /***
     * Register the listener on the kick modal.
     * @param {WebSocket} websocket
     */
    const registerKickModalListener = function (websocket) {
        document.getElementById("kick-modal").addEventListener("shown.bs.modal", function () {
            ListenerRegistry.kickModalShownListener(websocket);
        });
    }

    /***
     * Registers the listener on the start game button.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const registerStartBtnListener = function (websocket, lobbyId) {
        document.getElementById("start-btn").addEventListener("click", function () {
            ListenerRegistry.startBtnClickedListener(websocket, lobbyId);
        });
    }

    /***
     * Prepares and starts a game of 13TRIS.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const createGame = function (websocket, lobbyId) {
        addCanvas();
        loadGameEngineScript();
        toggleKickButtons();
        toggleScoreLabels();
        changeCardColors("border-success");
        hideStartBtn();
        Client.startSendingGameInfo(websocket, lobbyId);
    }

    /***
     * Updates the score on the card of a specific player.
     * @param {string} playerName
     * @param {number} score
     */
    const updateScore = function (playerName, score) {
        let label = document.getElementById(`score-${playerName}`);
        if (label) label.textContent = `Score: ${score}`;
    }

    /***
     * Changes the border color of the card of the specified player to signal if he is still in the game or not.
     * @param {string} playerName
     * @param {string} status
     */
    const updatePlayerState = function (playerName, status) {
        if (status === "Game over") {
            let classAttr = "card mb-3 border-danger player-card";
            document.getElementById(`player-card-${playerName}`).setAttribute("class", classAttr);
        }
    }

    /***
     * Toggles the hidden attribute of the start button.
     */
    const showStartBtn = function () {
        document.getElementById("start-btn").removeAttribute("hidden");
    }

    /***
     * Sleeps for the given time in seconds.
     * @param {number} seconds
     */
    const sleep = function (seconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < seconds * 1000);
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

    /***
     * Adds the canvas to the HTML where the game will be rendered.
     */
    function addCanvas() {
        let content = "<canvas id='my_canvas' width='1000px' height='1000px'/>";
        document.getElementById("content").innerHTML += content;
    }

    /***
     * Adds the canvas engine as script tag to the end of the head tag and runs its startGame() function as soon as it
     * is loaded.
     */
    function loadGameEngineScript() {
        let canvasEngineScript = document.createElement("script");
        canvasEngineScript.setAttribute("src", "/static/js/canvas_engine.js");
        canvasEngineScript.setAttribute("type", "text/javascript");
        let head = document.getElementsByTagName("head")[0];
        head.appendChild(canvasEngineScript);
        canvasEngineScript.onload = function () {
            startGame();
        }
    }

    /***
     * Toggles all the kick buttons on the player cards.
     */
    function toggleKickButtons() {
        let kickButtons = document.querySelectorAll("[data-kick]");
        for (const element of kickButtons) {
            element.toggleAttribute("hidden", true);
        }
    }

    /***
     * Toggles all the score labels on the player cards.
     */
    function toggleScoreLabels() {
        let labels = document.getElementsByClassName("score-label");
        for (const element of labels) {
            element.toggleAttribute("hidden");
        }
    }

    /***
     * Changes the border of all player cards to the specified color.
     * @param {string} bootstrapBorderColor
     */
    function changeCardColors(bootstrapBorderColor) {
        let playerCards = document.getElementsByClassName("player-card");
        let classAttr = `card mb-3 ${bootstrapBorderColor} player-card`;
        for (const element of playerCards) {
            element.setAttribute("class", classAttr);
        }
    }

    /***
     * Hides the start button for the player.
     */
    function hideStartBtn() {
        document.getElementById("start-btn").setAttribute("hidden", "true");
    }

    return {
        showInvitationModal: showInvitationModal,
        showKickModal: showKickModal,
        createPlayerCards: createPlayerCards,
        registerInvitationButtonListeners: registerInvitationButtonListeners,
        registerAcceptInvitationButtonListener: registerAcceptInvitationButtonListener,
        registerKickModalListener: registerKickModalListener,
        registerStartBtnListener: registerStartBtnListener,
        createGame: createGame,
        updateScore: updateScore,
        updatePlayerState: updatePlayerState,
        showStartBtn: showStartBtn,
        sleep: sleep,
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
        const data = JSON.parse(event.data);
        switch (data["type"]) {
            case "init":
                Client.receiveInit(data);
                break;
            case "invite":
                Client.receiveInvite(data, websocket, lobbyId);
                break;
            case "join":
                Client.receiveJoin(websocket, lobbyId);
                break;
            case "lobby-info":
                Client.receiveLobbyInfo(data, websocket, lobbyId);
                break;
            case "kick":
                Client.receiveKickEvent(websocket);
                break;
            case "start":
                Client.receiveStart(websocket, lobbyId);
                break;
            case "game-info":
                Client.receiveGameInfo(data);
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
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + lobbyId + "&playing=false");
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
            Client.invitedTo(null);
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
        if (Client.invitedTo() == null && lobbyId != null) {
            Client.sendLeaveEvent(websocket, lobbyId, user, false, false);
        }
    }

    /***
     * Listens for the invitation button being clicked.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     * @param {string} to
     */
    const sendInvitationListener = function (websocket, lobbyId, to) {
        Client.sendInviteEvent(websocket, lobbyId, to, user);
    }

    /***
     * Listens for the accept invitation button to be pressed.
     * @param {WebSocket} websocket
     * @param {HTMLElement} modal
     * @param {string} lobbyId
     */
    const acceptInvitationListener = function (websocket, modal, lobbyId) {
        modal.hide();
        Client.sendJoinEvent(websocket, Client.invitedTo(), user);
        Client.sendLeaveEvent(websocket, lobbyId, user, true, false);
        window.location.replace(window.location.href.split("?")[0] + "?lobby=" + Client.invitedTo() + "&playing=false");
    }

    /***
     * Listener for showing the kick modal.
     * @param {WebSocket} websocket
     */
    const kickModalShownListener = function (websocket) {
        UI.sleep(5);
        Client.sendInitEvent(websocket, user);
    }

    /***
     * Listener that sends a start event.
     * @param {WebSocket} websocket
     * @param {string} lobbyId
     */
    const startBtnClickedListener = function (websocket, lobbyId) {
        Client.sendStartEvent(websocket, lobbyId);
    }

    return {
        messageListener: messageListener,
        kickFromLobbyBtnListener: kickFromLobbyBtnListener,
        openConnectionListener: openConnectionListener,
        beforeunloadListener: beforeunloadListener,
        sendInvitationListener: sendInvitationListener,
        acceptInvitationListener: acceptInvitationListener,
        kickModalShownListener: kickModalShownListener,
        startBtnClickedListener: startBtnClickedListener,
    }
})();

// "Entry point" for this file
window.addEventListener("DOMContentLoaded", function () {
    const websocket = new WebSocket("ws://localhost:8001");
    const lobbyId = new URLSearchParams(window.location.search).get("lobby");
    const playing = new URLSearchParams(window.location.search).get("playing");
    Client.playing(playing === "true");
    window.addEventListener("beforeunload", function () {
        ListenerRegistry.beforeunloadListener(websocket, lobbyId);
    });
    UI.registerInvitationButtonListeners(websocket, lobbyId);
    UI.registerStartBtnListener(websocket, lobbyId);
    websocket.addEventListener("open", function () {
        ListenerRegistry.openConnectionListener(websocket, lobbyId);
    });
    websocket.addEventListener("message", function (event) {
        ListenerRegistry.messageListener(event, websocket, lobbyId);
    });
});
// END