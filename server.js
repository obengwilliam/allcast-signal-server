var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var io= require('socket.io')(http);


io.on('connection', function(socket){
    console.log('a use just connected');
});



var app = http.createServer(function(req,res){
    file.serve(req,res);
}).listen(8000);






