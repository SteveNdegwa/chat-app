const express = require('express');

const app = express();

const path = require('path');

const http = require('http');

// const cors = require("cors");


app.use(express.static(path.join(__dirname,"./public")));

// app.set('view engine', 'ejs');
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server);

app.get('/',(req,res)=>{
    res.sendFile(path.resolve("./index.html"))
})

app.get('/chat',(req,res)=>{
    res.sendFile(path.resolve("./chat.html"))
})

let user = "";

app.post('/',(req,res)=>{
    user = req.body.name;
    res.redirect("/chat");
})

io.on('connection',socket=>{
    let user2 = user;
    console.log(`${user2} joined the chart`);
    socket.emit('message',`${user2} connected on Socket ${socket.id}`);
    socket.emit('message',`welcome to the chart ${user2}`); // to the client

    socket.broadcast.emit('message',`${user} joined the chart`); // all clients but user
    // io.emit(); //all clients


    socket.on('chatMessage',(msg)=>{
        socket.broadcast.emit('chatMessage',msg,user2);
    })


    socket.on('disconnect',()=>{
        io.emit('message',`${user2} left the chart`);
    })

})


server.listen(3000, () => {
    console.log("server listening at port 3000");
})