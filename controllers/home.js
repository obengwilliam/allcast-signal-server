var express = require('express');
var router = express.Router();


module.exports=function(app){
    router.get('/',function(req,res){
        res.render('index',{
            title:'AllCast Signal Server'
        });
    });

    app.use('/',router);

};