import json
import unittest
import server
import websockets
import asyncio


class TestServer(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        self.task = asyncio.create_task(server.main())

    async def asyncTearDown(self):
        self.task.cancel()
        try:
            await self.task
        except asyncio.CancelledError:
            print("Task was cancelled")

    async def test_init(self):
        async with websockets.connect("ws://localhost:8001") as websocket:
            await websocket.send(json.dumps({"type": "init", "user": "felix"}))
            data = json.loads(await websocket.recv())
            lobby_id = data["lobby_id"]
            lobby, admin = server.LOBBIES[lobby_id]
            self.assertTrue(len(server.CONNECTED) == 1, "Expected 1, was {0}".format(len(server.CONNECTED)))
            self.assertEqual(data["type"], "init")
            self.assertTrue(len(server.LOBBIES) == 1)
            self.assertEqual(lobby, {"felix"})
            self.assertTrue(admin, "felix")
            await websocket.close()

    async def test_join(self):
        pass

    async def test_invite(self):
        connection1 = await websockets.connect("ws://localhost:8001")
        connection2 = await websockets.connect("ws://localhost:8001")
        await connection1.send(json.dumps({"type": "init", "user": "felix"}))
        await connection2.send(json.dumps({"type": "init", "user": "marc"}))
        data1 = json.loads(await connection1.recv())
        data2 = json.loads(await connection2.recv())
        self.assertEqual(data1["type"], "init")
        self.assertEqual(data2["type"], "init")
        self.assertTrue(len(server.CONNECTED) == 2)
        self.assertTrue(len(server.LOBBIES) == 2, "Expected 2, got {0}".format(len(server.LOBBIES)))
        await connection1.send(json.dumps({"type": "invite", "lobby_id": data1["lobby_id"], "to": "marc",
                                           "from": "felix"}))
        invitation = json.loads(await connection2.recv())
        self.assertEqual(invitation["type"], "invite")
        self.assertEqual(invitation["lobby_id"], data1["lobby_id"])
        self.assertEqual(invitation["to"], "marc")
        self.assertEqual(invitation["from"], "felix")


if __name__ == "__main__":
    unittest.main()
