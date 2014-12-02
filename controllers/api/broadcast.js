var express = require('express');
var broadCastRouter= express.Router();

var jwt = require('jsonwebtoken');
var jwtmiddleware= require('express-jwt');

var secret = require('../../config/secret');
var redisClient = require('../../config/redis_database').redisClient;
var tokenManager = require('../../config/token_manager');

// models
var Broadcaster=require('../../models/broadcaster').Broadcaster;
var User=require('../../models/user').User;



function errorDetail(msg){
    return {"detail":msg};
}

module.exports=function(app){

    broadCastRouter.post('/',jwtmiddleware({secret: secret.secretToken}), tokenManager.verifyToken,function(req, res) {
                console.log('hello');
                var user = req.user;
                var msg;
                var broadcastname = req.body.broadcastname|| '';
                var category = req.body.broadcastcategoryname.name || '';


                if (broadcastname===''||category==='') {

                     msg = 'broadcastname or category must not be empty';

                    return res.status(400).json(errorDetail(msg));
                }

                Broadcaster.findOne({broadCastName:broadcastname},function(err,dbBroadcast){
                    if(err){
                      return res.status(500).json(err);
                    }

                    if(dbBroadcast){
                        msg = 'broadcast name already exist';
                        User.findOne({_id:user.id},function(err,dbUser){
                            if(dbUser && dbUser.userName === dbBroadcast.userName){
                                    dbBroadcast.activity.push({connected:Date.now()});
                                    dbBroadcast.save();
                                    console.log(dbBroadcast, 'AM ONSLL');

                                    var broadCastDetail= {
                                        username:dbUser.userName,
                                        category:category,
                                        broadcastname:broadcastname,

                                    };
                                return res.status(200).json(broadCastDetail);
                            }else {

                              return res.status(400).send(errorDetail(msg));
                            }
                        });

                    }else if(dbBroadcast===null){
                            var broadcast = new Broadcaster();
                            broadcast.broadCastName = broadcastname;
                            broadcast.category = category;
                            broadcast.activity=[{connected:Date.now()}];

                            if (user) {
                                User.findOne({_id:user.id},function(err,dbUser){
                                    broadcast.userName=dbUser.userName;
                                    var broadCastDetail= {
                                        username:dbUser.userName,
                                        category:category,
                                        broadcastname:broadcastname,

                                    };

                                    broadcast.save(function(err) {
                                        if(err){
                                          msg="error ";
                                          return res.send(400).json(errorDetail(msg));
                                        }
                                    });

                                    return res.status(200).json(broadCastDetail);

                                });

                            }
                            else {
                                msg="Unauthorized";
                                return res.send(401).json(errorDetail(msg));
                            }



                    }
                });

    });

    broadCastRouter.get('/',jwtmiddleware({secret: secret.secretToken}), tokenManager.verifyToken, function(req,res){
            if (req.user) {
                return  ['joe', 'good', 'simon'];
            }
            else {
                return res.send(401);
            }

    });

    app.use('/api/v1.0/broadcasts', broadCastRouter);




};