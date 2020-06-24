"use strict";
var express               = require('express');
var router                = express.Router();
var session               = require('express-session');
var bodyParser            = require('body-parser');
const controller          = require('../controller');
const orgController       = controller.maindata;
const mdlw                = require('../middleware/user.mdlw');

router.get('/',function(req, res, next) {
    res.send("user working");
});

//user login
router.post('/login',orgController.maindata.signIn);

//user signup 
router.post('/sign_up',orgController.maindata.signUp);
 

module.exports = router;
