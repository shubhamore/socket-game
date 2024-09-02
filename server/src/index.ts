import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

interface Rooms {
  [roomId: string]: string[];
}
const rooms: Rooms = {};

io.on('connection', (socket: Socket) => {
  console.log('New client connected ', socket.id);

  socket.on('joinRoom', (roomId: string) => {
    console.log(`Client ${socket.id} trying to join room ${roomId}`);
    if (rooms[roomId] && rooms[roomId].length >= 2) {
      socket.emit('error', 'Room is full');
      return;
    }

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push(socket.id);
    socket.join(roomId);
    io.to(roomId).emit('message', `User ${socket.id} has joined the room`);
    io.to(roomId).emit('updatePlayers', rooms[roomId]);

    console.log(`Client ${socket.id} joined room ${roomId}`);
    socket.emit('joinRoomSuccess', roomId); // Emit success event
  });

  socket.on('createRoom', (roomId: string) => {
    console.log(`Client ${socket.id} trying to create room ${roomId}`);
    if (rooms[roomId]) {
      socket.emit('error', 'Room already exists');
      return;
    }

    rooms[roomId] = [socket.id];
    socket.join(roomId);
    io.to(roomId).emit('message', `Room ${roomId} created by user ${socket.id}`);
    io.to(roomId).emit('updatePlayers', rooms[roomId]);

    console.log(`Client ${socket.id} created room ${roomId}`);
    socket.emit('createRoomSuccess', roomId); // Emit success event
  });

  socket.on('move', ({ index, playerSign }: { index: number; playerSign: string }) => {
    for (const [roomId, clients] of Object.entries(rooms)) {
      if (clients.includes(socket.id)) {
        const opponent = clients.find((clientId) => clientId !== socket.id);
        if (opponent) {
          io.to(opponent).emit('move', { index, playerSign });
        }
        break;
      }
    }
  });

  socket.on('leaveRoom', (roomId: string) => {
    console.log(`Client ${socket.id} trying to leave room ${roomId}`);
    if (!rooms[roomId]) {
      socket.emit('error', 'Room does not exist');
      return;
    }

    const index = rooms[roomId].indexOf(socket.id);
    if (index !== -1) {
      rooms[roomId].splice(index, 1);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('message', `User ${socket.id} has left the room`);
        io.to(roomId).emit('updatePlayers', rooms[roomId]);
      }
    }

    socket.leave(roomId);
    console.log(`Client ${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
    for (const [roomId, clients] of Object.entries(rooms)) {
      const index = clients.indexOf(socket.id);
      if (index !== -1) {
        clients.splice(index, 1);
        if (clients.length === 0) {
          delete rooms[roomId];
        } else {
          io.to(roomId).emit('message', `User ${socket.id} has left the room`);
          io.to(roomId).emit('updatePlayers', clients);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
