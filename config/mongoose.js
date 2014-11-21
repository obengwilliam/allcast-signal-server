var mongoose=require('mongoose');

var User=require('../models/User').User;
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
                User.create({
                    firstName: 'demo',
                    lastName:'demo',
                    email:'demo@meltwater.org',
                    facebook:false,
                    userName:'demo',
                    password:'10308060',
                    roles:['regular']
                });

            }
        });
};


