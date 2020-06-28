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


//join group
router.post('/joingrp',orgController.maindata.joinGroup);
 

//chat history
router.post('/chat_his', orgController.maindata.fetchChatHistory);

module.exports = router;
