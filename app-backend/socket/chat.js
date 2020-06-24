const mongoose              = require('mongoose');
const request 				= require('request');
const bvalid                = require("bvalid");
const redis                 = require('redis');
const socketio              = require('socket.io');
const redisAdapter          = require('socket.io-redis');
const mongo                 = require('../services').Mongo;
const to                    = require('../services').Utility.to;
const helper                = require('../helper');
const utils					= require('../utils');
const configs               = require('../config/app').server;
const httpResponse          = helper.HttpResponse;
const constants             = helper.Constants;
const errorCodes            = helper.Errors;
const sendError 		    = httpResponse.sendError;
const sendSuccess			= httpResponse.sendSuccess;
var io;

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

module.exports.listen = function(app) {
   
    io = socketio(app,{
        adapter: redisAdapter({ pubClient: redis_publisher, subClient: redis_subscriber })
    });
    console.log("tes");
   
    io.on('connection',function(socket){
        console.log("Sssssssssssssss");
        console.log(socket);
        // handle_initialize(socket);
       
    });

    return io;
}