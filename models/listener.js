 var mongoose=require('mongoose');



 var ListenerSchema= mongoose.Schema({
                userName: {type:String,required:true},
                activity :[ {
                        broadcastName:{type:String,required:true},
                        joined: {type:Date, default:Date.now},
                        status : {type:String,default:'online'},
                        disconnected : {type:Date}
                }]

        });




//defining User model for UserSchema
var  Listener=mongoose.model('Listen',ListenerSchema);



module.exports.Listener=Listener;


