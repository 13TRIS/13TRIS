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

    async def test_server(self):
        self.connection1 = await websockets.connect("ws://localhost:8001")
        self.connection2 = await websockets.connect("ws://localhost:8001")
        connection3 = await websockets.connect("ws://localhost:8001")
        await self.connection1.send(json.dumps({"type": "init", "user": "felix"}))
        await self.connection2.send(json.dumps({"type": "init", "user": "marc"}))
        await connection3.send(json.dumps({"type": "init", "user": "daniel"}))
        self.data1 = json.loads(await self.connection1.recv())
        self.data2 = json.loads(await self.connection2.recv())
        data3 = json.loads(await connection3.recv())
        self.assertEqual(self.data1["type"], "init", "Expected 'init' event, got {0}".format(self.data1["type"]))
        self.assertEqual(self.data2["type"], "init", "Expected 'init' event, got {0}".format(self.data2["type"]))
        self.assertEqual(data3["type"], "init", "Expected 'init' event, got {0}".format(data3["type"]))
        self.assertTrue(len(server.LOBBIES) == 3, "Expected 3, was {0}".format(len(server.LOBBIES)))
        self.assertTrue(len(server.CONNECTED) == 3, "Expected 3, was {0}".format(len(server.CONNECTED)))
        self.assertEqual(server.LOBBIES[self.data1["lobby_id"]], ({"felix"}, "felix"))
        self.assertEqual(server.LOBBIES[self.data2["lobby_id"]], ({"marc"}, "marc"))
        self.assertEqual(server.LOBBIES[data3["lobby_id"]], ({"daniel"}, "daniel"))
        await self.invite()
        await self.join()

    async def invite(self):
        await self.connection1.send(json.dumps({"type": "invite", "lobby_id": self.data1["lobby_id"], "to": "marc",
                                                "from": "felix"}))
        invitation = json.loads(await self.connection2.recv())
        self.assertEqual(invitation["type"], "invite")
        self.assertEqual(invitation["lobby_id"], self.data1["lobby_id"])
        self.assertEqual(invitation["to"], "marc")
        self.assertEqual(invitation["from"], "felix")

    async def join(self):
        await self.connection2.send(json.dumps({"type": "join", "user": "marc", "lobby": self.data1["lobby_id"]}))
        join = json.loads(await self.connection1.recv())
        await self.connection2.send(
            json.dumps({"type": "leave", "lobby": self.data2["lobby_id"], "user": "marc", "instant": True}))
        self.assertEqual(server.LOBBIES[self.data1["lobby_id"]], ({"felix", "marc"}, "felix"))
        self.assertEqual(join["type"], "join")
        self.assertEqual(join["user"], "marc")
        self.assertTrue(len(server.CONNECTED) == 3)
        await asyncio.sleep(2)
        self.assertTrue(len(server.LOBBIES) == 2, "Expected 1 but was {0}".format(len(server.LOBBIES)))


if __name__ == "__main__":
    unittest.main()
