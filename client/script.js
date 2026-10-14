const { createElement } = require("react");

const messageEl = document.getElementById("messageInput")
const chatBodyEl = document.getElementById("chatBody")
const CSS = document.getElementById("CSS")
const wsUri = "ws://127.0.0.1/";
const websocket = new WebSocket(wsUri);

websocket.addEventListener("open", () => {
    console.log(`Connected to: ${wsUri}`)

})
function NickStart(webScok){

    webScok.send()
}
websocket.addEventListener("message", (mess) => {
    let messages = mess.split("/|.|\\:")
    let header = messages[0]
    let body = ""
    for(let i = 1; i < (messages.length);i++){
        body = body + messages[i]
    }
    if(header == "NICK"){
        getNick(0)
    }
    if(header == "NICK_EXISTS"){
        getNick(1)
    }
})
function getNick(exists){
    if(exists){
        let pop = createElement("div")
        pop.className = "popup"
        
        
    }
}