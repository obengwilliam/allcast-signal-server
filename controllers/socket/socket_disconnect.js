 module.exports.listen=function(io,socket){

     socket.on('disconnect', function (message) {
           console.log('disconnected');
           socket.broadcast.to(socket.room).emit('log',[">>>Initiator jux left "]);
           delete socket.username;
       });
 };
