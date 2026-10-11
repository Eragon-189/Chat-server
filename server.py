import asyncio

import websockets
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK

address = "127.0.0.1"
port = 12345
clients = []
nicknames = []


async def broadcast(message, sender):
    for client in clients:
        try:
            await client.send(f'{sender}/.\\:{message}')
        except (ConnectionClosedOK, ConnectionClosedError):
            clients.remove(client)


async def handler(websocket):
    while True:
        try:
            Message = await websocket.recv()
            ind = clients.index(websocket)
            name = nicknames[ind]
            broadcast(Message, name)   
        except (ConnectionClosedOK, ConnectionClosedError):
            index = clients.index(websocket)
            clients.remove(websocket)
            nickname = nicknames[index]
            broadcast(f'{nickname} has left the chat', nickname)
            nicknames.remove(nickname)

async def recive():
    await client.send("/.\\NICK")
    clients.append(client)
    if name not in nicknames:
        nicknames.append(name)
    else:
        await client.send("/.\\NICK_EXISTS")
        
async def main():
    async with websockets.serve(handler, address, port):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())