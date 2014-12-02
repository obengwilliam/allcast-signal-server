var mongoose=require('mongoose');



 var BroadcasterSchema= mongoose.Schema({
                broadCastName:{type:String,required:true},
                // make required true
                category:{type:String},
                userName: {type:String,required:true},
                created : {type:Date, default: Date.now ,required:true},
                activity :[ {
                        connected: {type:Date, default:Date.now, required:true},
                        disconnected : {type:Date}
                }]

        });




//defining User model for UserSchema
var  Broadcaster=mongoose.model('Broadcaster',BroadcasterSchema);



module.exports.Broadcaster=Broadcaster;

