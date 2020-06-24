const mongoose              = require('mongoose');
const request 				= require('request');
const bvalid                = require("bvalid");
const redis                 = require('redis');
const socketio              = require('socket.io');
const redisAdapter          = require('socket.io-redis');
const mongo                 = require('../../services').Mongo;
const to                    = require('../../services').Utility.to;
const helper                = require('../../helper');
const utils					= require('../../utils');
const configs               = require('../../config/app').server;
const httpResponse          = helper.HttpResponse;
const constants             = helper.Constants;
const errorCodes            = helper.Errors;
const crypt 				= utils.Crypt;
const JWT 					= utils.jwt;
const sendError 		    = httpResponse.sendError;
const sendSuccess			= httpResponse.sendSuccess;

var redis_client             = redis.createClient(configs.REDIS_PORT,configs.REDIS_HOST);
redis_client.auth(configs.REDIS_PASS);
redis_client.select(configs.REDIS_CHAT_DB, function() { /* ... */ });

redis_client.on("error", function (err) {
    console.log("Error " + err);
});

var redis_publisher         = redis.createClient(configs.REDIS_PORT,configs.REDIS_HOST);
redis_publisher.auth(configs.REDIS_PASS);

var redis_subscriber        = redis.createClient(configs.REDIS_PORT,configs.REDIS_HOST);
redis_subscriber.auth(configs.REDIS_PASS);




exports.signUp = function(req,res,next){
    
    req.checkBody('eml',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('pwd',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('cpwd',errorCodes.invalid_parameters[1]).notEmpty();

	if(req.validationErrors()){
       return sendError(res,req.validationErrors(),"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }
    
    function invaliParms(msg,flag){
        msg = msg ? msg : 'invalid_parameters';
        if(flag){
            return sendError(res,msg,"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST,true);
        }
        return sendError(res,msg,msg,constants.HTTP_STATUS.BAD_REQUEST);
    }

    if(!bvalid.isEmail(req.body.eml)){
        return invaliParms("invalid_email");
    }
    if(!(bvalid.isString(req.body.pwd) && bvalid.isString(req.body.cpwd))){
        return invaliParms();
    }
    if(req.body.pwd != req.body.cpwd){
        return invaliParms("password_not_match");
    }

    mongo.Model('account').findOne({
        'eml' : req.body.eml.trim().toLowerCase()
    },function(err0,resp0){
        if(err0){
            return sendError(res,"server_error","server_error");
        }
        if(resp0){
            return sendError(res,"account_already_exists","account_already_exists");
        }
        return saveNew();
    })
    function saveNew(){
        mongo.Model('account').insert({
            'eml' : req.body.eml,
            'pwd' : req.body.pwd
        },function(err0,resp0){
            if(err0){
                return sendError(res,"server_error","server_error");
            }
            var encrypt_aid = crypt.TwoWayEncode(resp0._id.toString(),configs.TWO_WAY_CRYPT_SECRET);
            var ob = {
                'id' : resp0._id,
                'eml' : resp0.eml,
                'role' : 1
            };
            var jtoken = JWT.sign(ob,configs.JWT_PRIVATE_KEY,60*60*24*30);
            return sendSuccess(res,{a_tkn : jtoken });
        })
    }
}

exports.signIn = async function(req,res,next){
    req.checkBody('eml',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('pwd',errorCodes.invalid_parameters[1]).notEmpty();

    if(req.validationErrors()){
  		return sendError(res,req.validationErrors(),"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }
    
    function invaliParms(msg,flag){
        msg = msg ? msg : 'invalid_parameters';
        if(flag){
            return sendError(res,msg,"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST,true);
        }
        return sendError(res,msg,msg,constants.HTTP_STATUS.BAD_REQUEST);
    }

    if(!bvalid.isEmail(req.body.eml)){
        return invaliParms("invalid_email");
    }

    if(!bvalid.isString(req.body.pwd)){
        return invaliParms("invalid_type_of_password");
    }

    mongo.Model('account').findOne({
        'eml' : req.body.eml,
        'act' : true
    },{
        pwd : 1
    },function(err0,resp0){
        if(err0){
            return sendError(res,"server_error","server_error");
        }
        if(!resp0){
            return invaliParms("account_not_found");
        }
       
        try{
            var isValid = crypt.decode(req.body.pwd , resp0.pwd); 
        }catch(err){
            return sendError(res,err,"server_error");
        }
        if(isValid){
            var ob = {
                'id' : resp0._id,
                'eml' : resp0.eml,
                'role' : 1
            };
            let jtoken  = JWT.sign(ob,configs.JWT_PRIVATE_KEY,60*60*24*30);
            return sendSuccess(res,{a_tkn : jtoken });
        } else {
            return sendError(res,"password_not_match","password_not_match");
        } 
    })
}



exports.fetchProducts = async function(req,res,next){
    req.checkBody('limit',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('pageno',errorCodes.invalid_parameters[1]).notEmpty();

    if(req.validationErrors()){
  		return sendError(res,req.validationErrors(),"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }

    try{
        var data = req.body;

        var query_string = {
            act : true,
        }

        var [err0, total_prod_count] = await to(mongo.Model('inventory').count(query_string)); 
        if(err0){
            return sendError(res,err0,"server_error");
        }
        var proj    = {};

        //fetching limited data at a time(pagination)
        var option  = {
            limit : data.limit,
            skip  : (data.pageno -1) * data.limit
        }

        var [err,products] = await to(mongo.Model('inventory').find(query_string, proj, option)); 
        // console.log(products);
        if(err){
            return sendError(res,err,"server_error");
        }
        return sendSuccess(res, {
            products        : products,
            total_products  :  total_prod_count
        })
    }catch(err){
        return sendError(res,err,"server_error");
    }
}
  