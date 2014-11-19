var socket_log= require('../../lib/socket-log');




 module.exports.listen=function(io,socket){
    var log = socket_log(socket);
    socket.on('message', function (message) {
           log('S --> got message: ', message);
           // should be room only
           console.log(socket.room,'room');
           if (socket.room) socket.broadcast.to(socket.room).emit('message', message);
           console.log('broadcast');

       });
 };
