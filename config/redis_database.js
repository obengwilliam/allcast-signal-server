var redis = require('redis');

if (process.env.REDISTOGO_URL) {
    // TODO: redistogo connection
    // inside if statement
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redisClient = require("redis").createClient(rtg.port, rtg.hostname);

    redisClient.auth(rtg.auth.split(":")[1]);

} else {
    var redisClient = require("redis").createClient();
}


redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

exports.redis = redis;
exports.redisClient = redisClient;