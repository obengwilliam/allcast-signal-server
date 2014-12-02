var mongoose=require('mongoose');

var jwt = require('jsonwebtoken');
var jwtmiddleware= require('express-jwt');

var secret = require('./secret');
var redisClient = require('./redis_database').redisClient;
var tokenManager = require('./token_manager');


var User=require('../models/user').User;
var saltHash=require('../lib/salthash');

module.exports=function(config){
        mongoose.connect(config.db);
        var db=mongoose.connection;
        db.on('error', console.error.bind(console,"connection error..."));
        db.once('open', function  callback (){
                console.log('Allcast db opened');
        });

        User.find({}, function(err, users){
            if(users.length===0) {
                var user=User.create({
                    firstName: 'demo',
                    lastName:'demo',
                    email:'demo@meltwater.org',
                    facebook:false,
                    userName:'demo',
                    password:'10308060',
                    roles:['regular']
                });
               jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });

            }

        });

};


