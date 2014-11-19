var socket_log = require('../../lib/socket-log');


module.exports.listen=function(io,socket){

    socket.on('start listening', function (message) {
           var log = socket_log(socket);
           log('S --> got message: ', message);
           // should be room only
           console.log(socket.room,'room');
           if (socket.room) socket.broadcast.to(socket.room).emit('message', message);
           console.log('broadcast');

       });
};
