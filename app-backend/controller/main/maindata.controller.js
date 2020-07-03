const mongoose              = require('mongoose');
const request 				= require('request');
const bvalid                = require("bvalid");
const moment                 = require('moment');
const redis                 = require('redis');
const mongo                 = require('../../services').Mongo;
const to                    = require('../../services').Utility.to;
const helper                = require('../../helper');
const utils					= require('../../utils');
const configs               = require('../../config/app').server;
const httpResponse          = helper.HttpResponse;
const constants             = helper.Constants;
const errorCodes            = helper.Errors;
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
        return saveNewAccount();    
    }else{
        return groupCheck(account);
    }

    function saveNewAccount(){
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
            return addGroupMember(account,group);
        }else{
            mongo.Model('group').insert(group_qstr,function(err2,resp){
                if(err2){
                    return sendError(res,"server_error","server_error");
                }
                return addGroupMember(account,resp);
            })
        }
    }

    async function addGroupMember(account,group){
        
        var grpmem_qstr = {
            aid : account._id ,
            gid : group._id,
            act : true,
        }
        var grpmem_proj = {is_blocked : 1};
        var grpmem_option = {};

        var [err1, groupmember] = await to(mongo.Model('groupmember').findOne(grpmem_qstr, grpmem_proj, grpmem_option)); 
        if(err1){
            return sendError(res,err0,"server_error");
        }
    
        if(groupmember){
            return sendSuccess(res,{
                aid : account._id,
                gid : group._id,
                groupmember : groupmember
            });
        }else{
            grpmem_qstr.is_blocked = false;
            mongo.Model('groupmember').insert(grpmem_qstr,function(err2,resp){
                if(err2){
                    return sendError(res,"server_error","server_error");
                }
                return sendSuccess(res,{
                    aid : account._id,
                    gid : group._id,
                    groupmember : resp
                });
            })
        }
    }
}

exports.fetchChatHistory = async function(req,res, next){
    req.checkBody('aid',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('gid',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('lmt',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('tim',errorCodes.invalid_parameters[1]).notEmpty();

	if(req.validationErrors()){
       return sendError(res,req.validationErrors(),"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }

    let data = req.body;

    function invaliParms(msg,flag){
        msg = msg ? msg : 'invalid_parameters';
        if(flag){
            return cb("invalid_parameters",null);
        }
        return cb(msg);
    }

    if(!utils.util.validMongoId(data.aid)){
        return invaliParms();
    }

    if(!utils.util.validMongoId(data.gid)){
        return invaliParms();
    }

    try{
   
        var message_qstr = {
            createdAt : {$lt : data.tim},
            gid : data.gid,
            msg_del : false,
            act : true,
        }
        var message_proj   = {};
        
        var message_option = {
            sort : {
                createdAt : -1 
            },
            limit : data.lmt
        };

        var [err1, messages] = await to(mongo.Model('message').find(message_qstr, message_proj, message_option)); 
        if(err1){
            return sendError(res,err0,"server_error");
        }
        
        if(messages.length == 0 ){
            return sendSuccess(res,{
                allmessages : messages
            });
        }

        let aids_arr = [];
        for(let i = 0 ; i < messages.length ; i++){
            if(aids_arr.indexOf(messages[i].aid+'') < 0){
                aids_arr.push(messages[i].aid+'');
            }
        }
        var account_qstr = {
            _id : {$in : aids_arr},
            act : true,
        }
        var account_proj   = {};
        
        var account_option = {};

        var [err1, accounts] = await to(mongo.Model('account').find(account_qstr, account_proj, account_option)); 

        let accounts_obj = {};
        for(let i = 0 ;i < accounts.length ; i++){
            if(!accounts_obj[accounts[i]._id+'']){
                accounts_obj[accounts[i]._id+''] = {};
            }
            accounts_obj[accounts[i]._id+''] = accounts[i];
        }

        for(let i = 0; i < messages.length ; i++){
            if(accounts_obj[messages[i].aid+'']){
                messages[i].account = accounts_obj[messages[i].aid+''];
            }
            
        }
        return sendSuccess(res,{
            allmessages : messages
        });

    }catch(err){
        return {err :err};
    }    
}

exports.checkGroupMember = async function(data,cb){
  
    try{
        function invaliParms(msg,flag){
            msg = msg ? msg : 'invalid_parameters';
            if(flag){
                return cb("invalid_parameters",null);
            }
            return cb(msg);
        }
    
        if(!utils.util.validMongoId(data.aid)){
            return invaliParms();
        }
    
        if(!utils.util.validMongoId(data.gid)){
            return invaliParms();
        }

        var account_qstr = {
            _id  : data.aid,
            act  : true,
        }
        var account_proj = {};
        var account_option = {};
    
        var [err0, account] = await to(mongo.Model('account').findOne(account_qstr,account_proj,account_option)); 
        if(err0){
            return cb("server_error");
        }
    
        if(!account){
            return cb("Account doesnot exist");
        }else{
            
            var group_qstr = {
                _id  : data.gid,
                act  : true,
            }
            var group_proj = {};
            var group_option = {};
    
            var [err1, group] = await to(mongo.Model('group').findOne(group_qstr, group_proj, group_option)); 
            if(err1){
                return cb("server_error");
            }
        
            if(!group){
                return cb("Group doesn't exist");
            }else{
                var grpmem_qstr = {
                    aid : data.aid ,
                    gid : data.gid,
                    act : true,
                }
                var grpmem_proj = {is_blocked : 1};
                var grpmem_option = {};
        
                var [err1, groupmember] = await to(mongo.Model('groupmember').findOne(grpmem_qstr, grpmem_proj, grpmem_option)); 
                if(err1){
                    return cb("server_error");
                }

                if(!groupmember){
                    return cb("This account is not a groupmember");
                }
                if(data.socket_id){
                    var groupmem_updated_obj = {
                        socket_id : data.socket_id
                    }
                    var [err2, groupmember] = await to(mongo.Model('groupmember').updateOne(grpmem_qstr, 
                        { $set : groupmem_updated_obj}
                    )); 
                   if(err2){
                        return cb("server_error");
                    }
                    return cb(null, true);
                }else{
                    return cb("No socket id exists");
                }
            }
        }
    }catch(err){
        return {err :err};
    }
}
  

exports.addNewMessage = async function(data,cb){
    try{

        function invaliParms(msg,flag){
            msg = msg ? msg : 'invalid_parameters';
            if(flag){
                return cb("invalid_parameters",null);
            }
            return cb(msg);
        }
    
        if(!utils.util.validMongoId(data.aid)){
            return invaliParms();
        }
    
        if(!utils.util.validMongoId(data.gid)){
            return invaliParms();
        }

        if(!bvalid.isString(data.msg)){
            return invaliParms();
        }

        var account_qstr = {
            _id  : data.aid,
            act  : true,
        }
        var account_proj = {};
        var account_option = {};
    
        var [err0, account] = await to(mongo.Model('account').findOne(account_qstr,account_proj,account_option)); 
        if(err0){
            return cb("server_error");
        }
      
        if(!account){
            return cb("Account doesnot exist");
        }else{
            
            var group_qstr = {
                _id  : data.gid,
                act  : true,
            }
            var group_proj = {};
            var group_option = {};
    
            var [err1, group] = await to(mongo.Model('group').findOne(group_qstr, group_proj, group_option)); 
            if(err1){
                return cb("server_error");
            }
        
            if(!group){
                return cb("Group doesn't exist");
            }else{
                var grpmem_qstr = {
                    aid : data.aid ,
                    gid : data.gid,
                    act : true,
                }
                var grpmem_proj = {is_blocked : 1};
                var grpmem_option = {};
        
                var [err1, groupmember] = await to(mongo.Model('groupmember').findOne(grpmem_qstr, grpmem_proj, grpmem_option)); 
                if(err1){
                    return cb("server_error");
                }

                if(!groupmember){
                    return cb("This account is not a groupmember");
                }
                
                if(groupmember.is_blocked){
                    return cb("User is blocked to message in this group");
                }else{
                    var message_qstr = {
                        aid : data.aid ,
                        gid : data.gid,
                        is_admin : data.isAdmin ? data.isAdmin : false,
                        msg_type : 1,                          //text
                        msg : data.msg,
                        act : true,
                    }
                    
                    var [err1, newmessage] = await to(mongo.Model('message').insert(message_qstr)); 
                   
                    if(err1){
                        return cb("server_error");
                    }
                    
                    var [err1, msg] = await to(mongo.Model('message').findOne({_id : newmessage._id})); 
                    
                    msg.account =  account;
                    let message = [];
                    message.push(msg);

                    let resp_obj = {
                        message : message,
                        success : true
                    }
                    return cb(null, resp_obj);
                }
            }
        }
    }catch(err){
        return {err :err};
    }
}

exports.getActiveGroupUsers = async function(gid, sockets ,cb){
    try{

        let activeusers = [];
        function invaliParms(msg,flag){
            msg = msg ? msg : 'invalid_parameters';
            if(flag){
                return cb("invalid_parameters",null);
            }
            return cb(msg);
        }
    
        if(!utils.util.validMongoId(gid)){
            return invaliParms();
        }

        var group_qstr = {
            _id  : gid,
            act  : true,
        }
        var group_proj = {};
        var group_option = {};

        var [err1, group] = await to(mongo.Model('group').findOne(group_qstr, group_proj, group_option)); 
        if(err1){
            return cb("server_error");
        }
    
        if(!group){
            return cb("Group doesn't exist");
        }else{
            var grpmem_qstr = {
                gid : gid,
                socket_id : {$in : sockets},
                act : true,
            }
            var grpmem_proj = {};
            var grpmem_option = {};
    
            var [err1, groupmembers] = await to(mongo.Model('groupmember').find(grpmem_qstr, grpmem_proj, grpmem_option)); 
            if(err1){
                return cb("server_error");
            }
            
            if(groupmembers.length ==  0){
                return cb(null, {
                    activeusers : activeusers,
                    success     : true
                });
            }

            let accountid_arr = [];
            let aid_by_socketids = {};

            for(let i = 0 ; i< groupmembers.length;i++){
                if(accountid_arr.indexOf(groupmembers[i].aid +'') < 0){
                    accountid_arr.push(groupmembers[i].aid +'');
                }    
                if(!aid_by_socketids[groupmembers[i].aid +'']){
                    aid_by_socketids[groupmembers[i].aid +''] = {};
                }
                aid_by_socketids[groupmembers[i].aid +''] = groupmembers[i].socket_id;
            }

            var account_qstr = {
                _id : {$in : accountid_arr},
                act : true,
            }
            var account_proj = {name :1};
            var account_option = { 
                sort : {
                    name : 1
                }
            };
            
            var [err1, users] = await to(mongo.Model('account').find(account_qstr, account_proj, account_option)); 
            if(err1){
                return cb("server_error");
            }

            for(let i = 0 ; i < users.length ; i++){
                if(aid_by_socketids[users[i]._id+'']){
                    activeusers.push({
                        _id : users[i]._id,
                        name : users[i].name,
                        socket_id : aid_by_socketids[users[i]._id+'']
                    })
                }
            }

            return cb(null, {
                activeusers : activeusers,
                gid : gid,
                success     : true
            });
            
        }
    }catch(err){
        return {err :err};
    }
}

exports.fetchInactiveUser = async function(socket_id){
    try{
        return new Promise( async (resolve,reject) => {
            var grpmem_qstr = {
                socket_id : socket_id,
                act : true,
            }
            var grpmem_proj = {};
            var grpmem_option = {};
    
            var [err1, groupmember] = await to(mongo.Model('groupmember').findOne(grpmem_qstr, grpmem_proj, grpmem_option)); 
            if(err1){
                reject("server_error");
            }
            
            if(!groupmember){
               reject("not valid user");
            }

            resolve(groupmember);
        })
    }catch(err){
        return {err :err};
    }
}