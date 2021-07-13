"use strict";

require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
app.set("view engine", "ejs");

// Peer
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});


app.use("/peerjs", peerServer);
app.use(express.static("public"));


app.get("/rejoin", (req,res) =>{
  res.render("endScreen");
});

app.get("/home",(req,res)=>{
  res.render("home");
})

app.get("/", (req, rsp) => {
  let meetingURL = `${uuidv4()}`;
  rsp.redirect(`/${meetingURL}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  //console.log(socket);
  
  console.log("["+socket.id+"]---> connection accepted");
  socket.on("join-room", (roomId, userId,userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId, userName);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
      //console.log("disconnect message broadcasted");
    });
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

server.listen(process.env.PORT || 3030);