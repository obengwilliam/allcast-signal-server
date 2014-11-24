var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var jwtmiddleware= require('express-jwt');

var secret = require('../../config/secret');
var redisClient = require('../../config/redis_database').redisClient;
var tokenManager = require('../../config/token_manager');

// models
var User=require('../../models/user').User;


var _ = require('lodash');

function errorDetail(msg){
    return {"detail":msg};
}

module.exports=function(app){

    router.post('/login', function(req,res){
            var msg;
            var username = req.body.username || '';
            var password = req.body.password || '';

            if(username === '' || password === ''){
                msg= "Username or password is empty";
                return res.status(401).json(errorDetail(msg));
            }

            User.findOne({userName: username}, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.status(401).json(errorDetail(err));
                }

                if (user === null) {
                    msg= "User does not exist";
                    return res.status(401).json(msg);
                }

                user.comparePassword(password, function(isMatch) {
                    if (!isMatch) {
                        msg="Username or password is wrong";
                        return res.status(401).json(errorDetail(msg));
                    }

                var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                var userDetail= {
                    username:user.userName,
                    firstname:user.firstName,
                    lastname:user.lastName,
                    email:user.email,
                };
                return res.status(200).json(_.assign(userDetail,{token:token}));
                });

            });
        });

    router.post('/',function(req, res) {

            var msg;
            var username = req.body.username || '';
            var password = req.body.password || '';
            var firstname= req.body.firstname || '';
            var lastname = req.body.lastname || '';
            var email = req.body.email || '';
            var passwordConfirmation = req.body.passwordConfirmation || '';

            if (username===''||password===''||firstname===''||lastname===''||email==='') {

                 msg = 'username or password or firstname or lastname or email might be empty';

                return res.status(400).json(errorDetail(msg));
            }

            if(password !==passwordConfirmation){

                msg = 'Password and Password Confirmation does not match';

                return res.status(400).json(errorDetail(msg));
            }
            //validate email:i guess it should be in the business logic


            User.findOne({userName:username},function(err,dbUser){
                if(err){
                  return res.status(500).json(err);
                }
                if(dbUser){
                    msg = 'username already exist';
                    return res.status(400).send(errorDetail(msg));
                }else if(dbUser===null){
                        var user = new User();
                        user.userName = username;
                        user.password = password;
                        user.email = email;
                        user.lastName = lastname;
                        user.firstName = firstname;

                        user.save(function(err) {
                            console.log(err);
                            if(err){
                                if(11000===err.code){
                                    msg ="email is already taken";
                                    return res.status(200).json(errorDetail(msg));
                                }else if(err.errors.email){
                                    return res.status(200).json(errorDetail(err.errors.email.message));
                                }

                                return res.status(200).json(errorDetail(err));

                            }else {
                                    //user details
                                    var userDetail= {
                                        username:username,
                                        firstname:firstname,
                                        lastname:lastname,
                                        email:email,
                                    };

                                    var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });


                                    return res.status(200).json(_.assign(userDetail,{'token':token}));
                            }

                        });

                }
            });





        });


    router.get('/logout',jwtmiddleware({secret: secret.secretToken}), tokenManager.verifyToken,function(req,res){
        if (req.user) {
            msg = "You are logged out";
            tokenManager.expireToken(req.headers);

            delete req.user;
            return res.status(200).json(errorDetail(msg));
        }
        else {
            return res.send(401);
        }
    });

    router.get('/me', jwtmiddleware({secret: secret.secretToken}), tokenManager.verifyToken,function(req,res){
        var user = req.user;


        if (user) {
            User.findOne({_id:user.id},function(err,dbUser){

                var userDetail= {
                    username:dbUser.userName,
                    firstname:dbUser.firstName,
                    lastname:dbUser.lastName,
                    email:dbUser.email,
                };

                return res.status(200).json(userDetail);
            });

        }
        else {
            msg="Unauthorized";
            return res.send(401).json(errorDetail(msg));
        }
    });

    app.use('/api/v1.0/accounts', router);

};