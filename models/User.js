 var mongoose=require('mongoose');
 var hash_pwd=require('../lib/salthash').hashPwd;



 var UserSchema= mongoose.Schema({
                firstName: String,
                lastName: String,
                email:String,
                number: Number,
                userName: String,
                salt: String,
                hash_pwd: String,
                roles: [String],

                facebook:Boolean,
                facebookId:String,
                facebookProfile:mongoose.Schema.Types.Mixed
        });


// defining method for our schema
UserSchema.methods={
                authenticate:function(password){
                        return hash_pwd(this.salt,password)===this.hash_pwd;
                }
        };


//defining User model for UserSchema
var  User=mongoose.model('User',UserSchema);



module.exports.User=User;


