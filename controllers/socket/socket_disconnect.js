var BroadCaster = require('../../models/broadcaster.js').Broadcaster;
var Listerner = require('../../models/listener.js').Listener;


//

 module.exports.listen=function(io,socket){

     socket.on('disconnect', function (message) {
           console.log('disconnected');
           console.log(socket.user, socket.room,'user is disconnected');
           if(socket.user&& socket.room){
              BroadCaster
              .update({
               broadCastName:socket.room,
               userName:socket.user.username,
               'activity.disconnected':{'$exists':false}},
               {'$set':{'activity.0.disconnected':Date.now()}}
               );

              socket.broadcast.to(socket.room).emit('log',[">>>Initiator jux left "]);
              delete socket.room;
           }

           console.log(socket.user,'there is no socket user');
       });
 };
