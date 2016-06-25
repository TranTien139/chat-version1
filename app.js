var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var nicknames=[];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new user',function(data, callback){
  	if(nicknames.indexOf(data) !=-1){
  	callback(false);
  	} else{
  		callback(true);
  		socket.nickname = data;
  		nicknames.push(socket.nickname);
  		updateNickName();
  		
  	}
  });
  socket.on('chat message', function(data){
    io.sockets.emit('new message', {msg:data, nick:socket.nickname});
  });

  function updateNickName(){
  	io.sockets.emit('usernames',nicknames);
  }

  socket.on('disconnect', function(data){
  	if(!socket.nickname) return;
  	nicknames.splice(nicknames.indexOf(socket.nickname), 1);
  	updateNickName();
  });
});

server.listen(3000, function(){
  console.log('listening on :3000');
});
