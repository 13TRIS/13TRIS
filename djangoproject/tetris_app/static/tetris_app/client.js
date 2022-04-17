window.addEventListener("DOMContentLoaded", () => {
    const websocket = new WebSocket("ws://localhost:8001");
    init(websocket);
    sendInvite(websocket);
    receive(websocket);
});

function sendInvite(websocket) {
    document.querySelectorAll(".invite").forEach(item => {
        item.addEventListener("click", () => {
            let event = {
                "type": "invite",
                "lobby": lobby_id,
                "user": item.id
            }
            websocket.send(JSON.stringify(event));
        });
    });
}

function receive(websocket) {
    websocket.addEventListener("message", ({data}) => {
        const event = JSON.parse(data);
        console.log(event);
        switch (event.type) {
            case "invite":
                console.log("user " + user + " was invited to lobby " + event.id)
                if (user === event.user) {
                    let text = "Do you want to accept the invitation from " + event.user + " and join the lobby " +
                        event.lobby + "?";
                    document.querySelector("#modal-text-content").textContent = text;
                    let modal = new bootstrap.Modal(document.querySelector("#invitation-modal"))
                    modal.show()
                }
                break;
        }
    });
}

function init(websocket) {
    let event = {
        "type": "init",
        "message": user + " connected",
        "lobby": lobby_id
    }
    websocket.addEventListener("open", () => {
        websocket.send(JSON.stringify(event));
    });
}