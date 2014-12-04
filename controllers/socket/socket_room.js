var socket_log = require('../../lib/socket-log');
var BroadCaster = require('../../models/broadcaster.js').Broadcaster;
var Listerner = require('../../models/listener.js').Listener;



module.exports.listen=function(io,socket){
     var log = socket_log(socket);

     socket.on('create or join', function (data) {
      var room=data.room;
      socket.user=data.user;

      console.log(socket.user, 'jux came in');

      var namespace = '/';
      var socketIds=[];


      for (var socketId in io.nsps[namespace].adapter.rooms[room]) {
           socketIds.push(socketIds);
       }
       var numClients = socketIds.length;
       console.log('The number of sockets trying ', numClients);



       log('S --> Room ' + room + ' has ' + numClients + ' client(s)');
       log('S --> Request to create or join room', room);
       // First client joining...
       if (numClients=== 0){
              socket.join(room);
              socket.room=room;
              socket.emit('created', room);




       } else if (numClients=== 1) {
           // Second client joining...
           io.sockets.in(room).emit('join', room);
           socket.join(room);
           socket.room=room;
           socket.emit('joined', room);

       } else if (numClients=== 2) {
           // Second client joining...
           io.sockets.in(room).emit('join', room);
           socket.join(room);
           socket.room=room;
           socket.emit('joined', room);

       }else if (numClients=== 3) {
           // Second client joining...
           io.sockets.in(room).emit('join', room);
           socket.join(room);
           socket.room=room;
           socket.emit('joined', room);

       }else {
           // max is two client
           socket.emit('full', room);

       }

   });

};
