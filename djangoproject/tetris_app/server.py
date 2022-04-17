import asyncio
import json

import websockets

CONNECTED = set()
LOBBY = {}


async def add_to_lobby(join_key):
    pass


async def handler(websocket):
    try:
        async for message in websocket:
            print("message received: " + message)
            event = json.loads(message)
            if event["type"] == "invite":
                websockets.broadcast(CONNECTED, message)
            elif event["type"] == "init":
                CONNECTED.add(websocket)
                LOBBY[event["lobby"]] = {websocket}
                print("connections: " + CONNECTED.__str__())
            elif event["type"] == "join":
                pass
    finally:
        CONNECTED.remove(websocket)


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
