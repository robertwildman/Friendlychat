//This file will be the backend of the chat room
//It will be running on node js
var http = require('http');
var express = require('express'), app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(roomaddress,username){
		socket.room = roomaddress
		socket.username = username;
		// send client to room 1
		socket.join(socket.room);
		// echo to client they've connected
		socket.emit('updatechat', 'Helping Chat', 'You have connected to ' + socket.room);
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(socket.room ).emit('updatechat', 'Helping Chat', username + ' has connected to the room');
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	socket.on('switchRoom', function(newroom){
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.emit('updatechat', 'Helping Chat', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'Helping Chat', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'Helping Chat', socket.username+' has joined this room');
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'Helping Chat', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});