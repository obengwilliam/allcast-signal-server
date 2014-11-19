var path=require('path');
var rootPath=path.normalize(__dirname + '/../');


module.exports={
                db:process.env.MONGOLAB_URI||'mongodb://localhost/allcast',
                rootPath:rootPath,
                port: process.env.PORT || 3000,

        };

