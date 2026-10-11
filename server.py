import asyncio

import websockets
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK

address = "127.0.0.1"
port = 12345
clients = []
nicknames = []

async def getName(client):
    if client in clients:
        ind = clients.index(client)
        name = nicknames[ind]
        return name
    return "DnE"

async def broadcast(message, sender):
    for client in clients:
        try:
            await client.send(f'{sender}/.\\:{message}')
        except (ConnectionClosedOK, ConnectionClosedError):
            name = await getName(client)
            clients.remove(client)
            nicknames.remove(name)
            await client.send(f'{name}/.\\:{name} has left the chat')


async def handler(websocket):
    while True:
        await websocket.send(".\\NICK")#send /.\NICK to tell cleint to send us the nickname 
        name = await websocket.recv()#recive nickname

        if name not in nicknames:#if name does not exist; continue func
            break
        
        await websocket.send("/.\\NICK_EXISTS")# if name already exists; try again
    nicknames.append(name)
    clients.append(websocket)


    try:
        async for Message in websocket: #get message
            ind = clients.index(websocket)
            name = nicknames[ind]
            await broadcast(Message, name)#broadcast mesage to all
    finally:
        if websocket in clients:
            index = clients.index(websocket)
            clients.remove(websocket)
            nickname = nicknames[index]
            nicknames.remove(nickname)
            await broadcast(f"{name} has left the chat", name)
     
async def main():
    async with websockets.serve(handler, address, port):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())