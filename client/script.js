const messageEl = document.getElementById("messageInput")
const chatBodyEl = document.getElementById("chatBody")
const butt = document.getElementById("send")
if (messageEl == null || chatBodyEl == null){
    throw new Error(`messageEl:${messageEl}, chatBodyEl:${chatBodyEl}`);
}
const protocol = "wss://"
const Uri = prompt("Enter URI/URL:")
const port = ":8080"
const websocket = new WebSocket(`${protocol}${Uri}${port}`);
const yourNickname = ""

websocket.addEventListener("open", () => {
    console.log(`Connected to: ${protocol}${Uri}${port}`)
    document.querySelector("title").textContent = "Chat-Conected"
})
websocket.addEventListener("message", (mess) => {
    let [head, rawBody] = twoSplit(mess.data,"/|.|\\|")
    if (head == "NICK"){
        getNick(false)
        return;
    }if (head == "NICK_EXISTS"){
        getNick(true)
        return;
    }if (head == "MESSAGE"){
        let [sender, message] = twoSplit(rawBody,"/|.|\\:")
        display(sender,message)
    }else{
        alert('Encounterd an error. Please ty agin later.')
        websocket.close()
    }
})
butt.addEventListener("click", ()=>{
    sendMessage()
})
function getNick(exists){
    let message = "Please enter a nickname:"
    if(exists){  
        message = "Please enter a diffrent nickname. That one is taken:"
    }
    let val = prompt(message)
    yourNickname = val
    if (websocket.readyState == websocket.OPEN){
        websocket.send(val)
    }else if (websocket.readyState == websocket.CLOSED) {
        alert("Websocket closed. Please reload.")
        throw new Error(`Connection closed`);
    } else {
        alert("Websocket state error. Please reload.")
        throw new Error(`State:${websocket.readyState}`);
    }
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
    let color = "#101010"
    if(sender = yourNickname){
        sender = "You"
        color = "#2525F0"
    }
    color = `background-color: ${color};`
    let container = document.createElement("div")
    let messageEle = document.createElement("p")
    let senderEl = document.createElement("p")
    senderEl.style = `font-weight:bold; font-size:15px; width:100%; ${color}`
    senderEl.textContent = sender
    senderEl.className = "messages"
    messageEle.style = "font-size:30px; border-radius: 10px"
    messageEle.textContent = message
    messageEle.className = "messages"
    container.style = "width:100%; font-size:15px; border-radius: 5px; display:flex; flex-direction: column;" 
    
    container.append(senderEl)
    container.append(messageEle)
    chatBodyEl.append(container)
}

function sendMessage(){
    if (websocket.readyState == websocket.OPEN){
        websocket.send(messageEl.value);
        messageEl.value = ""
    }else if (websocket.readyState == websocket.CLOSED) {
        alert("websocket closed reload.");
        throw new Error(`Connection closed`);
    } else {
        alert("websocket state error. Please reload.");
        throw new Error(`State:${websocket.readyState}`);
    }
}