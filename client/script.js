const messageEl = document.getElementById("messageInput")
const chatBodyEl = document.getElementById("chatBody")
const CSS = document.getElementById("CSS")
const wsUri = "ws://127.0.0.1/:12345";
const websocket = new WebSocket(wsUri);

websocket.addEventListener("open", () => {
    console.log(`Connected to: ${wsUri}`)
})
websocket.addEventListener("message", (mess) => {
    let [head, rawBody] = twoSplit(mess,"/.\\|")
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
    backPop.className = "backPop"
    document.getElementById("body").append(backPop)
    backPop.innerHTML = innerHtml

    let popSend = document.getElementById("popSend")
    popSend.style = ""
    let popInput = document.getElementById("popInput")
    popInput.style = ""
    let nickname = popSend.addEventListener("click", () => {
        let val = document.getElementById("popInput").value
        document.getElementsByClassName("backPop").remove()
        return val
    })
    websocket.send(nickname)
}

function twoSplit(mess,split){
    let messages = String(mess).split(split)
    let header = messages[0]
    let body = ""
    for(let i = 1; i < (messages.length);i++){
        body = body + messages[i]
    }
    return [header, body]
}

function display(){

}

function sendMessage(){
    
}