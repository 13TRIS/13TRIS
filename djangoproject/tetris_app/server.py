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
                thread = StoppableThread(target=leave_lobby, args=(event,))
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
    init_event = {
        "type": "init",
        "lobby_id": lobby_id,
    }
    print("lobby " + lobby_id + " created for " + event["user"])
    await websocket.send(json.dumps(init_event))


async def receive_join(event):
    # get the list of users associated with the lobby id from which the invite request was received
    lobby, admin = LOBBIES[event["lobby"]]
    # add the user to this list if he is not part of the lobby already
    if event["user"] not in lobby:
        join_event = {
            "type": "join",
            "user": event["user"],
        }
        for user in lobby:
            socket = CONNECTED[user]
            await socket.send(json.dumps(join_event))
        # needs to be added afterwards -> otherwise KeyError!
        lobby.add(event["user"])
    print(event["user"] + " joined " + str(LOBBIES[event["lobby"]]))


def leave_lobby(event):
    print(THREADS)
    # wait 5 seconds because something might come in from the user if he did not leave the site
    time.sleep(5)
    if THREADS[event["user"]].stopped():
        del THREADS[event["user"]]
        return
    # if we do not get an update request in those 5 second the player has left the page and we can delete
    lobby, admin = LOBBIES[event["lobby"]]
    if len(lobby) <= 1:
        del LOBBIES[event["lobby"]]
    else:
        for user in lobby:
            if user == event["user"]:
                del user
    del THREADS[event["user"]]
    print(event["user"] + " left lobby " + event["lobby"])


async def send_lobby_info(websocket, event):
    lobby, admin = LOBBIES[event["lobby"]]
    lobby_info = {
        "type": "lobby-info",
        "lobby": list(lobby),
        "admin": admin,
    }
    print("info about lobby " + str(LOBBIES[event["lobby"]]) + " was sent")
    await websocket.send(json.dumps(lobby_info))


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
