import asyncio
import websockets
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK
import sys
import datetime
import traceback

sys.setrecursionlimit(10**5)

address = "127.0.0.1"
port = 12345
clients = []
nicknames = []
def printLog(client, name, acction):
    date = datetime.datetime.now()
    dateWoMs = str(date).removesuffix(f'.{date.strftime('%f')}')#remove milliseconds from datetime  
    print(f'{dateWoMs}  {client}:{name} {acction}.')#log 

def removeClient(client):
    if client not in clients:# if client does not exist then return None
        return None
    index = clients.index(client)#if it does the find index
    clients.pop(index)          #and remove client
    return nicknames.pop(index)#and nickname wile returning nickname

async def broadcast(message, sender):
        #run client.send in parrallel to save time
    results = await asyncio.gather(*(client.send(f'{sender}/.\\:{message}') for client in tuple(clients)),
                                   return_exceptions=True,#return exeptions for prossesing later and dont cancel the rest
                                   timeout=None,
                                   cancel_on_error=False
                                   )

    for client, result in zip(tuple(clients),results):#deal with errors
        if isinstance(result, (ConnectionClosedOK,ConnectionClosedError)):
                #if disconected remove them and broadcast message
            name = removeClient(client)
            if name is not None:
                await broadcast(f'{name} has left the chat.', {name})
                printLog(client, name, f'has disconected from chat')
            elif isinstance(result, BaseException):
                    #if any other error remove them and print error to log
                removeClient(client)
                printLog(client, name, f"has left due to error {result}")
async def handler(websocket):
    try:
        while True:
                await websocket.send(".\\:NICK")#send /.\NICK to tell cleint to send us the nickname 
                name = await websocket.recv()#recive nickname

                if name not in nicknames:#if name does not exist; continue func
                    break
                printLog(websocket, name , f'has tried existing name {name}')
                await websocket.send("/.\\:NICK_EXISTS")# if name already exists; try again
                
        nicknames.append(name)
        clients.append(websocket)

        printLog(websocket, name, 'has sucsefuly joined chat')

        async for message in websocket: #get message from websocket conection
            await broadcast(message, name)#broadcast mesage to all
            printLog(websocket, name, f'said {message}')
    except (ConnectionClosedError,ConnectionClosedOK):
        printLog(websocket, name, 'has disconected from chat normally')
    except:
        e = traceback.format_exc()
        printLog(websocket, name, f'disconected from chat with error: {e}')
    finally:
        if websocket in clients:
            name = removeClient(websocket)   
            if name is not None: 
                await broadcast(f"{name} has left the chat", name)
    
async def main():
    print("starting server.")
    try:
        async with websockets.serve(handler, address, port):
            await asyncio.Future()
    except:
        printLog(None,None,f'Error starting:{traceback.format_exc()}')


if __name__ == "__main__":
    asyncio.run(main())