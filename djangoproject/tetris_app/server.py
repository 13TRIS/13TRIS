import asyncio
import json

import websockets

CONNECTED = {}
LOBBIES = {}


async def handler(websocket):
    try:
        async for message in websocket:
            print("message received: " + message)
            event = json.loads(message)
            if event["type"] == "invite":
                for connected in CONNECTED.values():
                    await connected[0].send(message)
            elif event["type"] == "init":
                CONNECTED[event["user"]] = websocket, event["sessionId"]
                LOBBIES[event["lobby"]] = {event["user"]}
                print("lobbies: " + LOBBIES.__str__())
                print("connections: " + CONNECTED.__str__())
            elif event["type"] == "join":
                # update connection of user (because of page reload/redirect)
                CONNECTED[event["user"]] = websocket, event["sessionId"]
                # get the list of users associated with the lobby id from which the invite request was received
                lobby = LOBBIES[event["lobby"]]
                # add the user to this list if he is not part of the lobby already
                if event["user"] not in lobby:
                    lobby.add(event["user"])
                for user in lobby:
                    socket, session = CONNECTED[user]
                    await socket.send(message)
                print("lobbies: " + LOBBIES.__str__())
            elif event["type"] == "leave":
                del LOBBIES[event["lobby"]]
    finally:
        for key in list(CONNECTED.keys()):
            if CONNECTED[key] == websocket:
                del CONNECTED[key]


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
