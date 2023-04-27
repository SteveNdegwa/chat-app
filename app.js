const express = require("express");

const app = express();

const path = require("path");

const http = require("http");

// const cors = require("cors");

app.use(express.static(path.join(__dirname, "./public")));

// app.set('view engine', 'ejs');
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server);

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./index.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.resolve("./chat.html"));
});

let user = "";
let room = "";

let json = [
  {
    patient_id: 1,
    doctor_id: 2,
    sender_id: 1,
    room: 12,
    date: "25-04-2023",
    time:"10:00",
    message: "How are you",
  },
  {
    patient_id: 1,
    doctor_id: 2,
    sender_id: 2,
    room: 12,
    date: "25-04-2023",
    time:"10:20",
    message: "Am good",
  },
  {
    patient_id: 1,
    doctor_id: 2,
    sender_id: 2,
    room: 12,
    date: "26-04-2023",
    time:"08:00",
    message: "You?",
  },
  {
    patient_id: 1,
    doctor_id: 2,
    sender_id: 1,
    room: 12,
    date: "26-04-2023",
    time:"09:12",
    message: "Am great",
  },
  {
    patient_id: 1,
    doctor_id: 2,
    sender_id: 2,
    room: 12,
    date: "27-04-2023",
    time:"04:00",
    message: "Okay",
  },
];

app.post("/", (req, res) => {
  user = req.body.name;
  room = req.body.room;
  res.redirect("/chat");
});

io.on("connection", (socket) => {
  let room2 = room;
  let user2 = user;

  let date = "";

  console.log(`${user2} joined the chart`);
  socket.emit("message", `${user2} connected on Socket ${socket.id}`);
  socket.emit("message", `welcome to the chart ${user2}`); // to the client

  socket.join(room2);

  socket.broadcast.to(room2).emit("message", `${user} joined the chart`); // all clients but user
  // io.emit(); //all clients

  let userId = 2;

  let d = new Date();
  let date2 =("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();

  json.forEach((message) => {
    if (message.room == room2) {

      if (!(message.date == date)) {
        date = message.date;
        if(message.date == date2){
            socket.emit("message", "Today");
        }else{   //// get previous day -- yesterday
            socket.emit("message", message.date);
        }
      }

      if (message.sender_id == userId) {
        socket.emit("retrieveSentChats", message.message, message.time);
      } else {
        socket.emit(
          "retrieveReceivedChats",
          message.message,
          message.sender_id,
          message.time
        );
      }
    }
  });

  socket.on("sentChatMessage", (msg,datee,time) => {
    if (!(date== datee)) {  // access last message and check date
        date = datee;
        socket.emit("message", "Today");
        socket.broadcast.to(room2).emit("message","Today");
      }
    socket.emit("sentChatMessage", msg,time);
  });

  socket.on("receivedChatMessage", (msg,datee,time) => {
    socket.broadcast.to(room2).emit("receivedChatMessage", msg, user2, time);
  });

  socket.on("disconnect", () => {
    io.to(room2).emit("message", `${user2} left the chart`);
  });
});

server.listen(3000, () => {
  console.log("server listening at port 3000");
});
