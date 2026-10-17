const messageEl = document.getElementById("messageInput")
const chatBodyEl = document.getElementById("chatBody")
if (messageEl == null || chatBodyEl == null){
    throw new Error(`messageEl:${messageEl}, chatBodyEl:${chatBodyEl}`);
}
const wsUri = "ws://https://psychic-space-engine-wvxgpj6vjvp6c9px5-12345.app.github.dev/";
const port = ""
const websocket = new WebSocket(`${wsUri}:${port}`);
//test commit
websocket.addEventListener("open", () => {
    console.log(`Connected to: ${wsUri}:${port}`)
})
websocket.addEventListener("message", (mess) => {
    let [head, rawBody] = twoSplit(mess.data,"/.\\|")
    if (head == "NICK"){
        getNick(false)
        return;
    }if (head == "NICK_EXISTS"){
        getNick(true)
        return;
    }
    let [sender, message] = twoSplit(rawBody,"/.\\:")
    display(sender,message)
})
function getNick(exists){
    let message = "Please enter a nickname."
    if(exists){  
        message = "Please enter a diffrent nickname. That one is taken."
    }

     let innerHtml = `
    <div id="mainPop" class="pop">${message}</div>
    <input id="popInput" class="pop" type="text" placeholder="Your nickname here">
    <button id="popSend" class="pop">Send</button>
    `

    let backPop = document.createElement("div")
    backPop.id = "backPop"
    document.body.append(backPop)
    backPop.innerHTML = innerHtml

    let popSend = document.getElementById("popSend")
    popSend.style = ""
    let popInput = document.getElementById("popInput")
    popInput.style = ""
    popSend.addEventListener("click", () => {
        let val = document.getElementById("popInput").value
        if (websocket.readyState == websocket.OPEN){
            document.getElementById("backPop").remove()
            websocket.send(val)
        }else if (websocket.readyState == websocket.CLOSED) {
            document.getElementById("backPop").remove()
            alert("websocket closed. Please reload.")
            throw new Error(`Connection closed`);
        } else {
            document.getElementById("backPop").remove()
            alert("websocket state error. Please reload.")
            throw new Error(`State:${websocket.readyState}`);
        }
    })
    
}

function twoSplit(mess,split){
    let messages = String(mess).split(split)
    let header = messages[0]
    let body = messages[1]
    if (body == undefined){
        body = ""
    }
    for(let i = 2; i < (messages.length);i++){
        body = `${body}${split}${messages[i]}`
    }
    return [header, body]
}

function display(sender, message){
    let container = document.createElement("div")
    let messageEle = document.createElement("p")
    let senderEl = document.createElement("p")
    senderEl.style = "font-weight:bold; font-size:15px;"
    senderEl.textContent = sender
    senderEl.className = "messages"
    messageEle.style = "font-size:30px; border-radius: 10px"
    messageEle.textContent = message
    messageEle.className = "messages"
    container.style = "font-size:15px; border-radius: 5px" 
    
    container.append(senderEl)
    container.append(messageEle)
    chatBodyEl.append(container)
}

function sendMessage(){
    if (websocket.readyState == websocket.OPEN){
        websocket.send(messageEl.value)
    }else if (websocket.readyState == websocket.CLOSED) {
        alert("websocket closed. Please reload.")  
        throw new Error(`Connection closed`);
    } else {
        alert("websocket state error. Please reload.")
        throw new Error(`State:${websocket.readyState}`);
    }
}