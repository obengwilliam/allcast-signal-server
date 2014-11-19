module.exports=function log(socket){


           return function(){
               var array = [">>> "];
               for (var i = 0; i < arguments.length; i++) {
               array.push(arguments[i]);
               }
               socket.emit('log', array);
           };
};