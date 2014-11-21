 var mongoose=require('mongoose');



 var ListenSchema= mongoose.Schema({
                userName: {type:String,required:true},
                activity :[ {
                        broadcastName:{type:String,required:true},
                        joined: {type:Date, default:Date.now},
                        status : {type:String,default:online},
                        disconnected : {type:Date}
                }]

        });




//defining User model for UserSchema
var  Listen=mongoose.model('Listen',ListenSchema);



module.exports.Listen=Listen;


