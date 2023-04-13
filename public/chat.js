const socket = io();

socket.on('message', (message) => {
    console.log(message);
    displayMessage(message);
})

socket.on('chatMessage', (message) => {
    console.log(message);
    displayChatMessage(message);
})

let displayMessage = (msg) => {
    const p = document.createElement('p');
    p.innerHTML = msg;
    p.className = "message";

    const messagesContainer = document.getElementById("messages-container");
    messagesContainer.appendChild(p);

}

let displayChatMessage = (msg) => {
  

    const div = document.createElement('div');
    div.innerHTML = msg;
    div.className = "receive-message";


    const messagesContainer = document.getElementById("messages-container");
    messagesContainer.appendChild(div);

}



const messageBtn = document.getElementById('message-btn');
messageBtn.addEventListener('click', () => {
    const messageField = document.getElementById('message');
    let message = messageField.value;
    const div = document.createElement('div');
    div.innerHTML = message;
    div.className = "send-message";


    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.appendChild(div);

    socket.emit('chatMessage', message);
})

const roomBtn = document.getElementById('room-btn');
roomBtn.addEventListener('click', () => {
    const roomField = document.getElementById('room');
    let room = roomField.value;
})