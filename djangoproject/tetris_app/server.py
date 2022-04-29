import asyncio
import json
import secrets
import time
from StoppableThread import StoppableThread

import websockets
from websockets.exceptions import ConnectionClosedOK

CONNECTED = {}
LOBBIES = {}
THREADS = {}


async def handler(websocket):
    try:
        async for message in websocket:
            event = json.loads(message)
            if event["type"] == "invite":
                print(event["from"] + " invited " + event["to"])
                await CONNECTED[event["to"]].send(message)
            elif event["type"] == "init":
                await receive_init(websocket, event)
            elif event["type"] == "join":
                await receive_join(event)
            elif event["type"] == "leave":
                if event["instant"] is True:
                    leave_lobby(event, True)
                    return
                thread = StoppableThread(target=leave_lobby, args=(event, False))
                THREADS[event["user"]] = thread
                thread.start()
            elif event["type"] == "update":
                if event["user"] in THREADS:
                    THREADS[event["user"]].stop()
                CONNECTED[event["user"]] = websocket
            elif event["type"] == "request":
                await send_lobby_info(websocket, event)
    except ConnectionClosedOK:
        pass
    finally:
        for key in list(CONNECTED.keys()):
            if CONNECTED[key] == websocket:
                del CONNECTED[key]


async def receive_init(websocket, event):
    lobby_id = secrets.token_urlsafe(12)
    CONNECTED[event["user"]] = websocket
    LOBBIES[lobby_id] = {event["user"]}, event["user"]
    await websocket.send(json.dumps(init_event(lobby_id)))


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


def leave_lobby(event, is_instant):
    # wait 5 seconds because something might come in from the user if he did not leave the site
    time.sleep(5)
    if not is_instant and THREADS[event["user"]].stopped():
        del THREADS[event["user"]]
        return
    # if we do not get an update request in those 5 second the player has left the page and we can delete
    lobby, admin = LOBBIES[event["lobby"]]
    websockets_in_lobby = set()
    if len(lobby) <= 1:
        del LOBBIES[event["lobby"]]
    else:
        for user in lobby.copy():
            if user == event["user"]:
                lobby.discard(user)
            else:
                websockets_in_lobby.add(CONNECTED[user])
        websockets.broadcast(websockets_in_lobby, json.dumps(lobby_info(lobby, admin)))
        if not is_instant:
            del THREADS[event["user"]]


async def send_lobby_info(websocket, event):
    lobby, admin = LOBBIES[event["lobby"]]
    await websocket.send(json.dumps(lobby_info(lobby, admin)))


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


def init_event(lobby_id):
    return {"type": "init", "lobby_id": lobby_id}


def lobby_info(lobby, admin):
    return {"type": "lobby-info", "lobby": list(lobby), "admin": admin}


def join_event(user):
    return {"type": "join", "user": user}


if __name__ == "__main__":
    asyncio.run(main())
