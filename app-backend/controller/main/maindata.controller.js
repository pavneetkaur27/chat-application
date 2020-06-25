const mongoose              = require('mongoose');
const request 				= require('request');
const bvalid                = require("bvalid");
const redis                 = require('redis');
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



exports.joinGroup = async function(req,res,next){
    
    req.checkBody('name',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('groupname',errorCodes.invalid_parameters[1]).notEmpty();
  
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

    var data = req.body;

    if(!bvalid.isString(data.name)){
        return invaliParms("invalid_name");
    }

    if(!bvalid.isString(data.groupname)){
        return invaliParms("invalid_group_name");
    }

    var account_qstr = {
        name : data.name,
        act  : true,
    }
    var account_proj = {};
    var account_option = {};

    var [err0, account] = await to(mongo.Model('account').findOne(account_qstr,account_proj,account_option)); 
    if(err0){
        return sendError(res,err0,"server_error");
    }

    if(!account){
        return saveNew();    
    }else{
        return groupCheck(account);
    }

    function saveNew(){
        mongo.Model('account').insert(account_qstr,function(err0,resp0){
            if(err0){
                return sendError(res,"server_error","server_error");
            }
           
            return groupCheck(resp0);
        })
    }
    async function groupCheck(account){

        var group_qstr = {
            g_name  :  data.groupname,
            act     : true,
        }
        var group_proj = {};
        var group_option = {};

        var [err1, group] = await to(mongo.Model('group').findOne(group_qstr, group_proj, group_option)); 
        if(err1){
            return sendError(res,err0,"server_error");
        }
    
        if(group){
            return sendSuccess(res,{
                aid : account._id,
                gid : group._id
             });
        }else{
            mongo.Model('group').insert(group_qstr,function(err2,resp){
                if(err2){
                    return sendError(res,"server_error","server_error");
                }
                return sendSuccess(res,{
                    aid : account._id,
                    gid : resp._id
                 });
            })
        }
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



exports.checkGroupMember = async function(data,cb){
    console.log("tess");

    try{
        console.log(data);
        
        function invaliParms(msg,flag){
            msg = msg ? msg : 'invalid_parameters';
            if(flag){
                return cb("invalid_parameters",null);
            }
            return cb(msg);
        }

        if(!bvalid.isString(data.name)){
            return invaliParms("invalid_name");
        }
    
        if(!bvalid.isString(data.groupname)){
            return invaliParms("invalid_group_name");
        }

        var account_qstr = {
            // name : 
            // act  : true,
        }

        var [err0, total_prod_count] = await to(mongo.Model('inventory').count(query_string)); 
        if(err0){
            return sendError(res,err0,"server_error");
        }
        // var proj    = {};

        // //fetching limited data at a time(pagination)
        // var option  = {
        //     limit : data.limit,
        //     skip  : (data.pageno -1) * data.limit
        // }

        // var [err,products] = await to(mongo.Model('inventory').find(query_string, proj, option)); 
        // // console.log(products);
        // if(err){
        //     return sendError(res,err,"server_error");
        // }
        // return sendSuccess(res, {
        //     products        : products,
        //     total_products  :  total_prod_count
        // })
    }catch(err){
        return {err :err};
    }
}
  