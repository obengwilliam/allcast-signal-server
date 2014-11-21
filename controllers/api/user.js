var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var jwtmiddleware= require('express-jwt');

var secret = require('../../config/secret');
var redisClient = require('../../config/redis_database').redisClient;
var tokenManager = require('../../config/token_manager');

// models
var User=require('../../models/User').User;


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
                return res.send(401);
            }

            User.findOne({userName: username}, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.send(401);
                }

                if (user === null) {
                    return res.send(401);
                }

                user.comparePassword(password, function(isMatch) {
                    if (!isMatch) {
                        console.log("Attempt failed to login with " + user.username);
                        return res.send(401);
                    }

                    var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });

                    console.log(token);
                    return res.json({token:token});
                });

            });
        });

    router.post('/',function(req, res) {
            if(req.user){
                msg= "You are already logged In";
                return  res.status(400).json(errorDetail(msg));
            }

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


            User.findOne({userName:username},function(err,user){
                if(err){
                  return res.status(500).json(err);
                }
                console.log(user);
                if(user){
                    console.log(user, 'db begin');
                    msg = 'username already exist';
                    return res.status(400).send(errorDetail(msg));
                }
            });


            var user = new User();
            user.userName = username;
            user.password = password;
            user.email = email;
            user.lastName = lastname;
            user.firstName = firstname;

            user.save(function(err) {});

            //user details
            var userDetail= {
                username:username,
                firstname:firstname,
                lastname:lastname,
                email:email,
            };
            var token = jwt.sign({id: user._id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });


            return res.status(200).json(_.assign(userDetail,{'token':token}));

        });


    router.get('/logout',jwtmiddleware({secret: secret.secretToken}),function(req,res){
        if (req.user) {
            tokenManager.expireToken(req.headers);

            delete req.user;
            return res.send(200);
        }
        else {
            return res.send(401);
        }
    });

    app.use('/api/v1.0/accounts', router);

};