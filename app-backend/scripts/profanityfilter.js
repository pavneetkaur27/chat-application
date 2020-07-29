const mongoose              = require('mongoose');
const request 			    = require('request');
const moment                = require('moment-timezone');
const readline              = require('readline');
const WebPurify             = require('webpurify');
const configs               = require('../config/app').server;

const wp = new WebPurify({
    api_key: configs.WEBPURIFY_API_KEY
});

const rL = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
  
connectMongoDb();
mongoose.connection.on('error', function(err){
  console.trace("MongoDb Connection Error " + err);
  console.log('Shutting Down the User Trace');
  process.exit(0);
});

mongoose.connection.on('connected', function(){
    console.log('Connected to mongodb!');   
    startProfanityScript();
});

function startProfanityScript() {
    console.log('-------PROFANITY BLACKLIST----------');
    console.log('\nPress 1 to ADD WORD IN PROFANITY BLACKLIST');
    console.log('\nPress 2 GET PROFANITY BLACKLIST');
    console.log('\nPress 3 Check PROFANITY');
    rL.question("\nEnter the option to explore : ", function(option_no) {
        if(isNaN(option_no)){
            console.log('Please Select the correct profile option');
            return startProfanityScript();
        }
        option_no = parseInt(option_no);
        switch (option_no) {
            case 1 :
                addBlackList();
                break;
            
            case 2 :
                getBlackList();
                break;
                
            case 3 :
                checkProfanity();   
                break;

            default :
                startProfanityScript();
                break;
        }
    })
}

function addBlackList(){
    rL.question("Enter the word to be added in blacklist : ", function(word) {
        if(!word) {
            console.log('\nOops, you need to provide a valid word');
            return addBlackList();
        }
        console.log(word);
        wp.addToBlacklist(word)
            .then(success => {
                if (success) { 
                    console.log('success!'); 
                    endScript();
                }
            }).catch (err => {
                console.log("ERROR: ", err);
                endScript();
            });
    })
}

function getBlackList(){
   
    wp.getBlacklist()
        .then(blacklist => {
            console.log(blacklist);
            for (const word in blacklist) {
                console.log(blacklist[word]);
            }
            endScript();
        }).catch (err => {
            console.log("ERROR: ", err);
            endScript();
        });
}


function checkProfanity() {
    rL.question("Enter the word to check its profanity: ", function(word) {
        if (!word) {
            console.log('\nOops, you need to provide a valid word');
            return addBlackList();
        }
        console.log(word);
        wp.check(word)
            .then(profanity => {
            if (profanity) {
                console.log('Profanity found!');
                endScript();
            } else {
                console.log('Its gud');
                endScript();
            }
        }).catch (err => {
            console.log("ERROR: ", err);
            endScript();
        });
    })
}
function endScript() {
    console.log('Exiting...');
    return process.exit();
}
 
function connectMongoDb() {
    return mongoose.connect("mongodb://localhost:27017/chatdb"); 
}