const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require("./utils/users");
// const { Socket } = require("node:dgram");

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const PORT = 3000 || process.env.PORT
const botName = "Admin"


app.use(express.static(path.join(__dirname, "public")))

// Runs when client connects
io.on("connection", socket => {
    console.log("New Web scoket connection...");

    socket.on("joinRoom", ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room)

        // Welcome to current user
        socket.emit("message", formatMessage(botName, `Welcome to ${user.room}`));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));

        // send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when cient disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`)); // to all the clients

            // send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });

        }
    });
})


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));