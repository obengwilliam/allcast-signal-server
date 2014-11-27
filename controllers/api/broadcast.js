var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var jwtmiddleware= require('express-jwt');

var secret = require('../../config/secret');
var redisClient = require('../../config/redis_database').redisClient;
var tokenManager = require('../../config/token_manager');

// models
var User=require('../../models/broadcaster').Broadcaster;



function errorDetail(msg){
    return {"detail":msg};
}

module.exports=function(app){

    router.post('/broadcast',jwtmiddleware({secret: secret.secretToken}), tokenManager.verifyToken,function(req, res) {
                console.log('hello');
                var user = req.user;
                var msg;
                var broadcastname = req.body.broadcastname|| '';
                var category = req.body.broadcastcategoryname || '';


                if (broadcastname===''||category==='') {

                     msg = 'broadcastname or category must not be empty';

                    return res.status(400).json(errorDetail(msg));
                }

                Broadcaster.findOne({broadCastName:broadcastname},function(err,dbDroadcast){
                    if(err){
                      return res.status(500).json(err);
                    }
                    if(dbBroadcast){
                        msg = 'broadcast name already exist';
                        return res.status(400).send(errorDetail(msg));
                    }else if(dbBroadcast===null){
                            var broadcast = new Broadcaster();
                            broadcast.broadCastName = broadcastname;
                            broadcast.category = category;
                            if (user) {
                                User.findOne({_id:user.id},function(err,dbUser){
                                    broadcast.userName=dbUser.userName;
                                });

                            }
                            else {
                                msg="Unauthorized";
                                return res.send(401).json(errorDetail(msg));
                            }

                            console.log(req.user);

                            /*Broadcaster.save(function(err) {


                            });*/

                    }
                });

        router.get('/broadcast',jwtmiddleware({secret: secret.secretToken}), tokenManager.verifyToken, function(req,res){
                if (req.user) {
                    return  ['joe', 'good', 'simon'];
                }
                else {
                    return res.send(401);
                }

            });

    app.use('/api/v1.0/', router);





        });




};