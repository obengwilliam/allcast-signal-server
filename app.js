
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var server =http.Server(app);

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


// socket.io
var io = require('socket.io')(server);

// Let's start managing connections...
io.on('connection', function (socket){

        // Handle 'message' messages


    socket.on('create or join', function (room) {

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

        }else {
            // max is two client
            socket.emit('full', room);

        }

    });


    socket.on('message', function (message) {
        log('S --> got message: ', message);
        // should be room only
        console.log(socket.room,'room');
        if (socket.room) socket.broadcast.to(socket.room).emit('message', message);
        console.log('broadcast');

    });

    socket.on('start listening', function (message) {
        log('S --> got message: ', message);
        // should be room only
        console.log(socket.room,'room');
        if (socket.room) socket.broadcast.to(socket.room).emit('message', message);
        console.log('broadcast');

    });


    socket.on('disconnect', function (message) {
        console.log('disconnected');
        socket.broadcast.to(socket.room).emit('log',[">>>Initiator jux left "]);
        delete socket.username;
    });



    function log(){
        var array = [">>> "];
        for (var i = 0; i < arguments.length; i++) {
        array.push(arguments[i]);
        }
        socket.emit('log', array);
        }


});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





