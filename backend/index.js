var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 12345;

io.on('connection', function(socket){
  socket.on('update', function(changes){
    socket.broadcast.emit('update', changes);
  });

  socket.on('caret change', function(change){
    socket.broadcast.emit('caret change', {
      position: change.position,
      socket: socket.id
    });
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
