import asyncio
import json
import secrets

import time
from StoppableThread import StoppableThread

import websockets

CONNECTED = {}
LOBBIES = {}
THREADS = {}


async def handler(websocket):
    try:
        async for message in websocket:
            print(message)
            event = json.loads(message)
            if event["type"] == "invite":
                await receive_invite(event, message)
            elif event["type"] == "init":
                await receive_init(websocket, event)
            elif event["type"] == "join":
                await receive_join(event)
            elif event["type"] == "leave":
                thread = StoppableThread(target=leave_lobby, args=(event,))
                THREADS[event["user"]] = thread
                thread.start()
            elif event["type"] == "update":
                receive_update(event, websocket)
            elif event["type"] == "request":
                await send_lobby_info(websocket, event)
            elif event["type"] == "game-info":
                send_game_state(event)
            elif event["type"] == "start":
                lobby_websockets = get_websockets_in_lobby(event["lobby"])
                websockets.broadcast(lobby_websockets, message)
            print("lobbies: " + LOBBIES.__str__())
            print("connections: " + CONNECTED.__str__())
            print("threads: " + THREADS.__str__())
    finally:
        delete_connection(websocket)


def delete_connection(websocket):
    for key in list(CONNECTED.keys()):
        if CONNECTED[key] == websocket:
            print(key + " lost connection")
            del CONNECTED[key]


def receive_update(event, websocket):
    if event["user"] in THREADS:
        THREADS[event["user"]].stop()
    CONNECTED[event["user"]] = websocket


async def receive_init(websocket, event):
    lobby_id = secrets.token_urlsafe(12)
    CONNECTED[event["user"]] = websocket
    LOBBIES[lobby_id] = {event["user"]}, event["user"]
    await websocket.send(json.dumps(init_event(lobby_id)))


async def receive_invite(event, message):
    if event["to"] in CONNECTED:
        await CONNECTED[event["to"]].send(message)


async def receive_join(event):
    # get the list of users associated with the lobby id from which the invite request was received
    lobby, admin = LOBBIES[event["lobby"]]
    # add the user to this list if he is not part of the lobby already
    if event["user"] not in lobby:
        for user in lobby:
            socket = CONNECTED[user]
            await socket.send(json.dumps(join_event(event["user"])))
        # needs to be added afterwards -> otherwise KeyError!
        lobby.add(event["user"])


def leave_lobby(event):
    # wait 5 seconds because something might come in from the user if he did not leave the site
    if not event["instant"]:
        time.sleep(5)
        if THREADS[event["user"]].stopped():
            del THREADS[event["user"]]
            return
    # if we do not get an update request in those 5 second the player has left the page and we can delete
    lobby, admin = LOBBIES[event["lobby"]]
    if len(lobby) <= 1:
        del LOBBIES[event["lobby"]]
    else:
        lobby.discard(event["user"])
        websockets.broadcast(get_websockets_in_lobby(event["lobby"]), json.dumps(lobby_info(lobby, admin)))
        if event["kick"]:
            new = secrets.token_urlsafe(12)
            user_iter = {CONNECTED[event["user"]]}
            websockets.broadcast(user_iter, json.dumps(kick_event(event["lobby"], new)))

    if admin == event["user"] and event["lobby"] in LOBBIES:
        lobby_id = secrets.token_urlsafe(12)
        rnd_user = lobby.pop()
        lobby.add(rnd_user)
        LOBBIES[lobby_id] = lobby, rnd_user
        websockets.broadcast(get_websockets_in_lobby(event["lobby"]), json.dumps(init_event(lobby_id)))
        del LOBBIES[event["lobby"]]

    del THREADS[event["user"]]


async def send_lobby_info(websocket, event):
    lobby, admin = LOBBIES[event["lobby"]]
    await websocket.send(json.dumps(lobby_info(lobby, admin)))


def send_game_state(event):
    lobby_websockets = get_websockets_in_lobby(event["lobby"])
    websockets.broadcast(lobby_websockets, json.dumps(event))


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


def init_event(lobby_id):
    return {"type": "init", "lobby_id": lobby_id}


def lobby_info(lobby, admin):
    return {"type": "lobby-info", "lobby": list(lobby), "admin": admin}


def join_event(user):
    return {"type": "join", "user": user}


def kick_event(lobby_id, new):
    return {"type": "kick", "lobby": lobby_id, "new": new}


def get_websockets_in_lobby(lobby_id):
    lobby, _ = LOBBIES[lobby_id]
    lobby_websockets = set()
    for user in lobby:
        lobby_websockets.add(CONNECTED[user])
    return lobby_websockets


if __name__ == "__main__":
    asyncio.run(main())
