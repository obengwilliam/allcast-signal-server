var express = require('express');

module.exports =function(app){
    require('../controllers/api/broadcast')(app);
    require('../controllers/api/user')(app);
    require('../controllers/home')(app);
};