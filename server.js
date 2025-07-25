const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};
const rooms = {};

io.on('connection', (socket) => {
  socket.on('join-room', ({ username, room }) => {
    if (!rooms[room]) rooms[room] = [];
    if (rooms[room].includes(username)) {
      socket.emit('username-exists');
      return;
    }

    socket.username = username;
    socket.room = room;
    users[socket.id] = username;
    rooms[room].push(username);

    socket.join(room);
    io.to(room).emit('system-message', `${username} joined`);
    io.to(room).emit('user-list', rooms[room]);
  });

  socket.on('send-message', (message) => {
    io.to(socket.room).emit('chat-message', {
      message,
      user: socket.username,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on('disconnect', () => {
    if (socket.room && rooms[socket.room]) {
      rooms[socket.room] = rooms[socket.room].filter(u => u !== socket.username);
      io.to(socket.room).emit('system-message', `${socket.username} left`);
      io.to(socket.room).emit('user-list', rooms[socket.room]);
    }
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));