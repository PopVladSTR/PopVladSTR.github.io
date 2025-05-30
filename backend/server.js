// backend/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

let connectedUsers = 0;
let messageCount = 0;

io.on("connection", (socket) => {
  connectedUsers++;
  console.log("User connected:", socket.id);

  io.emit("users", connectedUsers);

  socket.on("chatMessage", (data) => {
    messageCount++;
    io.emit("chatMessage", data);
    io.emit("stats", { messageCount, lastMessageTime: new Date().toISOString() });
  });

  socket.on("disconnect", () => {
    connectedUsers--;
    io.emit("users", connectedUsers);
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running.");
});

server.listen(5000, () => console.log("Server started on http://localhost:5000"));
