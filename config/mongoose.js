var mongoose=require('mongoose');

var User=require('../models/User').User;
var saltHash=require('../lib/salthash');

module.exports=function(config){
        mongoose.connect(config.db);

        var db=mongoose.connection;
        db.on('error', console.error.bind(console,"connection error..."));
        db.once('open', function  callback ()
        {
                console.log('Herohires db opened');
        });


        User.find({}, function(err, users){
            if(users.length===0) {
                var salt=saltHash.createSalt();
                var hash=saltHash.hashPwd(salt,'10308060');
                User.create({firstName: 'william', lastName:'obeng', email:'william@meltwater.org',facebook:false, userName:'billobeng',salt:salt,hash_pwd:hash,roles:['taskmaster']});

            }
        });
};


