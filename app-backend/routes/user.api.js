"use strict";
var express               = require('express');
var router                = express.Router();
var session               = require('express-session');
var bodyParser            = require('body-parser');
const controller          = require('../controller');
const orgController       = controller.main;
const mdlw                = require('../middleware/user.mdlw');

router.get('/',function(req, res, next) {
    res.send("user working");
});

//user login
router.post('/login',orgController.maindata.signIn);

//join group
router.post('/joingrp',orgController.maindata.joinGroup);
 

module.exports = router;
