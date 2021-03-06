var debug= require('debug')('all-cast-signal-server');
var express = require('express');
var app = express();
var config = require('./config/config');
var tokenManager = require('./config/token_manager');
var secret = require('./config/secret');
//configurations
require('./config/express')(app,config);
require('./config/mongoose')(config);


//controllers
require('./config/controllers')(app);



//server
var server=app.listen(config.port,function(){
    console.log('Express server listening on port',config.port);

});

//socket
var io = require('socket.io')(server);

var socketioJwt = require('socketio-jwt');


io.set(socketioJwt.authorize({
  secret: secret,
  handshake: true
}));

io.on('connection', function(socket){
       // Handle 'message' messages
    require('./controllers/socket/socket_listening').listen(io,socket);
    require('./controllers/socket/socket_message').listen(io,socket);
    require('./controllers/socket/socket_room').listen(io,socket);
    require('./controllers/socket/socket_disconnect').listen(io,socket);


});

