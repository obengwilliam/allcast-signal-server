var mongoose=require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;



 var UserSchema= mongoose.Schema({
                firstName: {type:String,required:true},
                lastName: {type:String,required:true},
                email: {type:String,required:true, unique:true,lowercase:true},
                userName: {type:String,required:true,unique:true},
                password: {type:String,required:true},
                roles: [String],
                created: {type:Date, default:Date.now},

                facebookId:{type:String,required:false},
                resetPasswordToken:String,
                resetPasswordExpires: Date,
        });




// Bcrypt middleware on UserSchema
UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
  });
});


//Password verification
UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        callback(isMatch);
    });
};



//defining User model for UserSchema
var  User=mongoose.model('User',UserSchema);



module.exports.User=User;


