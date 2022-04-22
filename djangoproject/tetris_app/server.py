import asyncio
import json
import secrets
import pickle

import websockets

CONNECTED = {}
LOBBIES = {}


async def handler(websocket):
    try:
        async for message in websocket:
            event = json.loads(message)
            if event["type"] == "invite":
                print(event["from"] + " invited " + event["to"] + " into lobby " + event["lobby"])
                await CONNECTED[event["to"]].send(message)
            elif event["type"] == "init":
                lobby_id = secrets.token_urlsafe(12)
                LOBBIES[lobby_id] = {event["user"]}, event["user"]
                init_event = {
                    "type": "init",
                    "lobby_id": lobby_id,
                }
                print("user " + event["user"] + " was added to lobby " + lobby_id)
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
                    lobby.add(event["user"])
                    for user in lobby:
                        socket = CONNECTED[user]
                        await socket.send(json.dumps(join_event))
            elif event["type"] == "leave":
                lobby, admin = LOBBIES[event["lobby"]]
                if len(lobby) <= 1:
                    print("deleted lobby " + event["lobby"])
                    del LOBBIES[event["lobby"]]
                else:
                    lobby, admin = LOBBIES[event["lobby"]]
                    for user in lobby:
                        if user == event["user"]:
                            del user
                            print("removed user " + event["user"] + "from lobby " + event["lobby"])
            elif event["type"] == "update":
                CONNECTED[event["user"]] = websocket
            elif event["type"] == "request":
                lobby, admin = LOBBIES[event["lobby"]]
                lobby_info = {
                    "type": "lobby-info",
                    "lobby": list(lobby),
                    "admin": admin,
                }
                print("info about lobby " + event["lobby"] + ":" + LOBBIES[event["lobby"]].__str__() + " was requested")
                await websocket.send(json.dumps(lobby_info))
    finally:
        print("websocket " + websocket.__str__() + " lost connection")
        for key in list(CONNECTED.keys()):
            if CONNECTED[key] == websocket:
                del CONNECTED[key]


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
