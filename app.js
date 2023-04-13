const express = require('express');

const app = express();

const path = require('path');

const http = require('http');


app.use(express.static(path.join(__dirname,"./public")));

// app.set('view engine', 'ejs');


const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server);

app.get('/',(req,res)=>{
    res.sendFile(path.resolve("./public/chat.html"))
})

io.on('connection',socket=>{
    console.log("User Connected");
    socket.emit('message',`User Connected on Socket ${socket.id}`);
    socket.emit('message',"welcome to steven"); // to the client

    socket.broadcast.emit('message',"user joined the chart"); // all clients but user
    // io.emit(); //all clients


    socket.on('chatMessage',(msg)=>{
        socket.broadcast.emit('chatMessage',msg);
    })


    socket.on('disconnect',()=>{
        io.emit('message',"User Left The Chart");
    })

})


server.listen(3000, () => {
    console.log("server listening at port 3000");
})