const socket = io();

socket.on('message', (message) => {
    console.log(message);
    displayMessage(message);
})

socket.on('chatMessage', (message,user) => {
    console.log(message);
    displayChatMessage(message,user);
})

let displayMessage = (msg) => {
    const div = document.createElement('div');
    div.className = "message-wrap";
    const p = document.createElement('p');
    p.innerHTML = msg;
    p.className = "message";

    div.append(p);

    const messagesContainer = document.getElementById("messages-container");
    messagesContainer.appendChild(div);

}

let displayChatMessage = (msg,user) => {
  
    const div = document.createElement('div');
    const p = document.createElement('p');
    const name = document.createElement('p');
    name.innerText = user;
    p.innerText = msg;
    div.className = "receive-message-div";
    p.className = "receive-message-p";
    name.className = "receive-name";

    div.append(name);
    div.append(p);


    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.appendChild(div);

}



const messageBtn = document.getElementById('message-btn');
messageBtn.addEventListener('click', () => {
    const messageField = document.getElementById('message');
    let message = messageField.value;
    const div = document.createElement('div');
    const p = document.createElement('p');
    const name = document.createElement('p');
    name.innerText = "You";
    p.innerText = message;
    div.className = "send-message-div";
    p.className = "send-message-p";
    name.className = "send-name";

    div.append(name);
    div.append(p);


    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.appendChild(div);

    socket.emit('chatMessage', message);
})

const roomBtn = document.getElementById('room-btn');
roomBtn.addEventListener('click', () => {
    const roomField = document.getElementById('room');
    let room = roomField.value;
})