import asyncio
import json
import secrets

import websockets
from websockets.exceptions import ConnectionClosedOK

CONNECTED = {}
LOBBIES = {}


async def handler(websocket):
    try:
        async for message in websocket:
            event = json.loads(message)
            print(message)
            if event["type"] == "invite":
                await CONNECTED[event["to"]].send(message)
            elif event["type"] == "init":
                lobby_id = secrets.token_urlsafe(12)
                CONNECTED[event["user"]] = websocket
                LOBBIES[lobby_id] = {event["user"]}, event["user"]
                init_event = {
                    "type": "init",
                    "lobby_id": lobby_id,
                }
                await websocket.send(json.dumps(init_event))
            elif event["type"] == "join":
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
            elif event["type"] == "leave":
                lobby, admin = LOBBIES[event["lobby"]]
                if len(lobby) <= 1:
                    del LOBBIES[event["lobby"]]
                    print(LOBBIES)
                else:
                    for user in lobby:
                        if user == event["user"]:
                            del user
            elif event["type"] == "update":
                CONNECTED[event["user"]] = websocket
            elif event["type"] == "request":
                lobby, admin = LOBBIES[event["lobby"]]
                lobby_info = {
                    "type": "lobby-info",
                    "lobby": list(lobby),
                    "admin": admin,
                }
                await websocket.send(json.dumps(lobby_info))
    except ConnectionClosedOK:
        pass
    finally:
        for key in list(CONNECTED.keys()):
            if CONNECTED[key] == websocket:
                del CONNECTED[key]


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
