var BroadCaster = require('../../models/broadcaster.js').Broadcaster;
var Listerner = require('../../models/listener.js').Listener;


//

 module.exports.listen=function(io,socket){

     socket.on('disconnect', function (message) {
           console.log('disconnected');
           console.log(socket.user);

           // BroadCaster
           // .update(
           //      {
           //          userName:socket.user.userName,
           //          broadCastName:socket.room,
           //          activity:{$slice:-1}
           //      },
           //      {'$set':{'activity.disconnected':}

           //  },function(err){
           //      console.log(err);
           //  });

           socket.broadcast.to(socket.room).emit('log',[">>>Initiator jux left "]);
           delete socket.room;
           console.log(socket.user);
       });
 };
