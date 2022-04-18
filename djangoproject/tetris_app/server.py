import asyncio
import json

import websockets

CONNECTED = set()
LOBBIES = {}


async def handler(websocket):
    try:
        async for message in websocket:
            print("message received: " + message)
            event = json.loads(message)
            if event["type"] == "invite":
                websockets.broadcast(CONNECTED, message)
            elif event["type"] == "init":
                CONNECTED.add(websocket)
                LOBBIES[event["lobby"]] = {websocket}
                print("lobbies: " + LOBBIES.__str__())
                print("connections: " + CONNECTED.__str__())
            elif event["type"] == "join":
                # get the list of websockets associated with the lobby id from which the invite request was received
                connected = LOBBIES[event["lobby"]]
                websockets.broadcast(connected, message)
                # add the websocket to this list
                connected.add(websocket)
                print("lobbies: " + LOBBIES.__str__())
            elif event["type"] == "leave":
                del LOBBIES[event["lobby"]]
    finally:
        CONNECTED.remove(websocket)
        # TODO: remove lobby as well


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
