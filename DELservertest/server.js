
// variable express is storing a function call
var express = require('express');

// call the express function
var app = express();
var server = app.listen(3000);

// host these files to the website
app.use(express.static('public'));

console.log("My server is working");


// same as express, need to require the socket.io library
var socket = require('socket.io');

// keeps track of connections, in and out
var io = socket(server);

// handle the main cases for connection and disconnetion
io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection :' + socket.id);

  // if there is a message called mouse then trigger this function
  socket.on('move', playerMove);

  function playerMove(data) {
    socket.broadcast.emit('move',data);
    console.log(data);
  }
}
