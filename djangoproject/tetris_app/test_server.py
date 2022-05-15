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
        # connect to the websocket server with 3 connections
        self.connection1 = await websockets.connect("ws://localhost:8001")
        self.connection2 = await websockets.connect("ws://localhost:8001")
        connection3 = await websockets.connect("ws://localhost:8001")
        # send an init event to create 3 lobbies for each connection/user
        await self.connection1.send(json.dumps({"type": "init", "user": "felix"}))
        await self.connection2.send(json.dumps({"type": "init", "user": "marc"}))
        await connection3.send(json.dumps({"type": "init", "user": "daniel"}))
        # receive an init back from the server with the lobby id
        self.data1 = json.loads(await self.connection1.recv())
        self.data2 = json.loads(await self.connection2.recv())
        data3 = json.loads(await connection3.recv())
        # the received event from the server should be an init event
        self.assertEqual(self.data1["type"], "init", "Expected 'init' event, got {0}".format(self.data1["type"]))
        self.assertEqual(self.data2["type"], "init", "Expected 'init' event, got {0}".format(self.data2["type"]))
        self.assertEqual(data3["type"], "init", "Expected 'init' event, got {0}".format(data3["type"]))
        # there should be 3 individual lobbies and 3 websocket connections to the server
        self.assertTrue(len(server.LOBBIES) == 3, "Expected 3, was {0}".format(len(server.LOBBIES)))
        self.assertTrue(len(server.CONNECTED) == 3, "Expected 3, was {0}".format(len(server.CONNECTED)))
        # check if each lobby represents the correct tuple
        self.assertEqual(server.LOBBIES[self.data1["lobby_id"]], ({"felix"}, "felix"))
        self.assertEqual(server.LOBBIES[self.data2["lobby_id"]], ({"marc"}, "marc"))
        self.assertEqual(server.LOBBIES[data3["lobby_id"]], ({"daniel"}, "daniel"))
        await self.invite()
        await self.join()
        await self.leave()

    async def invite(self):
        # 'marc' sends an invitation to 'felix'
        await self.connection1.send(json.dumps({"type": "invite", "lobby_id": self.data1["lobby_id"], "to": "marc",
                                                "from": "felix"}))
        # 'marc' receives the invitation
        invitation = json.loads(await self.connection2.recv())
        # check if the received message has the correct type
        self.assertEqual(invitation["type"], "invite")
        # check if the received lobby id is the same that was sent by user 'felix'
        self.assertEqual(invitation["lobby_id"], self.data1["lobby_id"])
        self.assertEqual(invitation["to"], "marc")
        self.assertEqual(invitation["from"], "felix")

    async def join(self):
        # 'marc' wants to join 'felix' after he received his invitation
        await self.connection2.send(json.dumps({"type": "join", "user": "marc", "lobby": self.data1["lobby_id"]}))
        # 'felix' received the join request of 'marc'
        join = json.loads(await self.connection1.recv())
        # if 'marc' joins 'felix' he has to leave his own lobby
        await self.connection2.send(
            json.dumps(
                {"type": "leave", "lobby": self.data2["lobby_id"], "user": "marc", "instant": True, "kick": False}))
        # 'marc' should now be in the lobby of 'felix'
        self.assertEqual(server.LOBBIES[self.data1["lobby_id"]], ({"felix", "marc"}, "felix"))
        self.assertEqual(join["type"], "join")
        self.assertEqual(join["user"], "marc")
        # there should still be 3 connections to the server
        self.assertTrue(len(server.CONNECTED) == 3)
        # the number of lobbies should now be one less because 'marc' joined 'felix'
        await asyncio.sleep(1)  # wait till the leave lobby thread is finished and removed the lobby
        self.assertTrue(len(server.LOBBIES) == 2, "Expected 2 but was {0}".format(len(server.LOBBIES)))
        self.assertEqual(server.CONNECTED.keys(), {"felix", "daniel", "marc"})

    async def leave(self):
        # users 'felix' and 'marc' leave the lobby
        self.assertTrue(server.THREADS.__len__() == 0)
        await self.connection1.send(
            json.dumps({"type": "leave", "lobby": self.data1["lobby_id"], "user": "marc", "instant": False,
                        "kick": False}))
        await self.connection2.send(
            json.dumps({"type": "leave", ",lobby": self.data1["lobby_id"], "user": "felix", "instant": False,
                        "kick": False}))
        await asyncio.sleep(1)
        self.assertEqual(len(server.THREADS), 1)
        await asyncio.sleep(6)
        self.assertEqual(len(server.LOBBIES), 1)
        # user 'felix' and 'marc' close their connections to the server
        await self.connection1.close()
        await self.connection2.close()
        await asyncio.sleep(1)
        # after the connections were closed only connection 3 should still be connected
        self.assertTrue(len(server.CONNECTED) == 1)
        self.assertEqual(server.CONNECTED.keys(), {"daniel"})


if __name__ == "__main__":
    unittest.main()
