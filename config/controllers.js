var express = require('express');
var router = express.Router();

module.exports =function(app){
    require('../controllers/api/user')(app);
    require('../controllers/home')(app);
};