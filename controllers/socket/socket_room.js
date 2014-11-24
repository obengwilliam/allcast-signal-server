var socket_log = require('../../lib/socket-log');
var BroadCaster = require('../../models/broadcaster.js').Broadcaster;
var Listerner = require('../../models/listener.js').Listener;



module.exports.listen=function(io,socket){
     var log = socket_log(socket);

     socket.on('create or join', function (room) {

      socket.user={
        userName:'demo'
      };

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
           BroadCaster.findOne({broadCastName:room},function(err,broadcaster){
             //check errors
             console.log(broadcaster,'caster');
             if(broadcaster===null){

                //could be better
                //check if user activity already exist

                 var newbroadcaster = new BroadCaster();
                 newbroadcaster.broadCastName=room;
                 newbroadcaster.userName = socket.user.userName;
                 newbroadcaster.activity={
                   broadcastName:room
                 };
                 newbroadcaster.save(function(err){
                   console.log(err);
                   if(!err){
                      console.log('new broadcaster');
                      socket.emit('created', room);

                   }
                 });





             }
             else if(broadcaster){
              //check if it is the same user

                console.log(broadcaster.userName, socket.user.userName);
                //check if broacaster is our old broadcaster
                if(broadcaster.userName==socket.user.userName){
                  broadcaster.activity
                  .push({
                  connected:Date.now
                });
                broadcaster.save();

                  socket.emit('created', room);
                  console.log('old broadcaster');
                }else{

                socket.emit('room exist');
                }
             }
           });


       } else if (numClients=== 1) {
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
