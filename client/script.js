const messageEl = document.getElementById("messageInput")
const chatBodyEl = document.getElementById("chatBody")
const butt = document.getElementById("send")
if (messageEl == null || chatBodyEl == null){
    alert(`messageEl:${messageEl}, chatBodyEl:${chatBodyEl}`)
    throw new Error(`messageEl:${messageEl}, chatBodyEl:${chatBodyEl}`);
}
let hasConnected = false
const protocol = "wss://";
let Url = prompt("Enter Url/URL:")
const PREFIX1 = "www."
const PREFIX2 = "https://"
if (Url == null){
    alert("Please reload and enter a Url/URL.")
    throw new Error(`No nickname`);    
}else if (Url.startsWith(PREFIX1)) {
  Url = Url.slice(PREFIX1.length);
}else if (Url.startsWith(PREFIX2)) {
  Url = Url.slice(PREFIX2.length);
}
let port = prompt("Enter port:")
if(port == null || port == ""){
    port = ""
}else{
    port = `:${port}`
}
const websocket = new WebSocket(`${protocol}${Url}${port}`);
let yourNickname = ""

websocket.addEventListener("open", () => {
    console.log(`Connected to: ${protocol}${Url}${port}`)
    hasConnected = true
    document.querySelector("title").textContent = "Chat-Conected"
    alert(`Conected to ${Url}`)
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
        alert('Encounterd an error. Please try agin later.')
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
    let color = "#606070"
    if(sender == yourNickname){
        sender = "You"
        color = "#2525F0"
    }
    let borderColor = "#252590"
    let container = document.createElement("div")
    let messageEle = document.createElement("p")
    let senderEl = document.createElement("p")
    senderEl.style = `font-weight:bold; border-color: ${borderColor} border-radius: 10px; border:solid; border-weight:5px; font-size:20px; width:100%; background-color: ${color};`
    senderEl.textContent = sender
    senderEl.className = "messages"
    messageEle.style = `font-size:25px; border-color: ${borderColor} border:solid; border-weight:5px; border-radius: 10px;`
    messageEle.textContent = message
    messageEle.className = "messages"
    container.style = `width:100%; border-color: ${borderColor} font-size:15px; border-radius: 15px; border: solid; border-weight: 5px; display: flex; flex-direction: column;` 
    
    container.append(senderEl)
    container.append(messageEle)
    chatBodyEl.append(container)
}

function sendMessage(){
    if (websocket.readyState == websocket.OPEN){
        websocket.send(messageEl.value);
        messageEl.value = ""
    }else if(hasConnected == false){
        alert("Never conected. Please reload and check URL and port.");
        throw new Error(`Never Conected to websocket`);
    }else if (websocket.readyState == websocket.CLOSED) {
        alert("websocket closed reload.");
        throw new Error(`Connection closed`);
    }else {
        alert("websocket state error. Please reload.");
        throw new Error(`State:${websocket.readyState}`);
    }
}