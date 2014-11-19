var  crypto=require('crypto');


function createSalt(){
        return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt,pwd){
        var hmac=crypto.Hmac('sha1',salt);
        return hmac.update(pwd).digest('hex');
}


module.exports.createSalt=createSalt;
module.exports.hashPwd=hashPwd;

