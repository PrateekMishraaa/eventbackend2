// socket.js
const socketIO = require('socket.io');

let io;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

function emitToRoom(roomId, event, data) {
  if (io) {
    io.to(roomId).emit(event, data);
  }
}

module.exports = {
  initializeSocket,
  emitToRoom
};