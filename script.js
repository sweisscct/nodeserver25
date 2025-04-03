const PORT = 3000
const url = `ws://localhost:${PORT}`
const wsServer = new WebSocket(url);

const username = prompt("What is your username?");
localStorage.setItem("username", username);

const newChat = document.getElementById("new-chat");
function sendMessage() {
    console.log(newChat.value);
    if (newChat.value) {
        const data = {
            username, // username: username,
            message: newChat.value
        }
        console.log(data);
        console.log(JSON.stringify(data));
        wsServer.send(JSON.stringify(data));
        newChat.value = "";
    } else {
        console.log("Message is blank")
    }
}
const sendNewChatButton = document.getElementById("send-new-chat");
sendNewChatButton.addEventListener("click", () => {
    sendMessage();
})

function displayChat(newMessage) {
    let newText = document.createElement("p");
    newText.innerText = `${newMessage.username}: ${newMessage.message}`;
    let chatContainer = document.getElementById("chat-container");
    chatContainer.appendChild(newText);
}

wsServer.onmessage = (event) => {
    const { data } = event;
    console.log(data);
    displayChat(JSON.parse(data));
}