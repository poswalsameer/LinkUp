// console.log("Hello world");

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

//creating mapping between every user to their socket id
const userToSocketMapping = new Map();

//creating mapping between every socket id to their user
const socketToUserMapping = new Map();

// makeOffer();

//this creates a socket connection 
io.on('connection', (socket) => {
    console.log("A new user joined: ", socket.id);

    //this listens for the socket event named "join-room" and logs the message 
    socket.on('join-room', async (data) => {
        console.log(data);
        const {username, roomNumber} = data;
        userToSocketMapping.set(username, socket.id);
        socketToUserMapping.set(socket.id, username);

        //whenever someone enters the same room number, this cod emits the username and socket id of that user 
        io.to(roomNumber).emit( "user-joined", { username, socketId: socket.id } );

        //allowing the other users to join the room
        socket.join(roomNumber);
    })

    socket.on('make-call', ({to, offer}) => {
      // console.log(offer);
      io.to(to).emit( 'incoming-call', { from: socket.id, offer } );
    })
})

const port = 8000;
httpServer.listen(port, () => {
    console.log("Server is running on port:",port );
})