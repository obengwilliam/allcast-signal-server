var mongoose=require('mongoose');



 var BroadcastSchema= mongoose.Schema({
                broadcastName:{type:String,required:true},
                userName: {type:String,required:true},
                created : {type:Date, default: Date.now ,required:true},
                activity :[ {
                        streamDate: {type:Date, default:Date.now, required:true},
                        status : {type:String,default:online},
                        disconnected : {type:Date}
                }]

        });




//defining User model for UserSchema
var  Broadcast=mongoose.model('Broadcast',BroadcastSchema);



module.exports.Broadcast=Broadcast;

