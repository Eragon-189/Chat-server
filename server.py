import asyncio
import websockets
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK
import sys

sys.setrecursionlimit(10**5)

address = "127.0.0.1"
port = 12345
clients = []
nicknames = []

def removeClient(client):
    if client not in clients:
        return None
    index = clients.index(client)
    clients.pop(index)
    return nicknames.pop(index)

async def broadcast(message, sender):
    results = await asyncio.gather(*(client.send(f'{sender}/.\\:{message}') for client in tuple(clients)),
                                   return_exceptions=True,
                                   timeout=None,
                                   cancel_on_error=False
                                   )

    for client, result in zip(tuple(clients),results):
        if isinstance(result, (ConnectionClosedOK,ConnectionClosedError)):
            name = removeClient(client)
            if name is not None:
                await broadcast(f'{name} has left the chat.', {name})
            elif isinstance(result, BaseException):
                raise result

async def handler(websocket):
    try:
        while True:
                await websocket.send(".\\:NICK")#send /.\NICK to tell cleint to send us the nickname 
                name = await websocket.recv()#recive nickname

                if name not in nicknames:#if name does not exist; continue func
                    break
                
                await websocket.send("/.\\:NICK_EXISTS")# if name already exists; try again
                
        nicknames.append(name)
        clients.append(websocket)

        async for message in websocket: #get message from websocket conection
            await broadcast(message, name)#broadcast mesage to all
    except (ConnectionClosedError,ConnectionClosedOK):
        pass
    finally:
        if websocket in clients:
            name = removeClient(websocket)   
            if name is not None: 
                await broadcast(f"{name} has left the chat", name)
     
async def main():
    async with websockets.serve(handler, address, port):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())