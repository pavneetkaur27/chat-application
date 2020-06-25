const mongoose             = require('mongoose');
const Crypt                = require('../utils').Crypt;
const errors               = require('../helper').Errors;
const bv                   = require('bvalid');

const model_name = 'account';

const schema = mongoose.Schema({
    name    : {type : String,trim: true,default : "No Name" }, //user name
    act     : { type : Boolean, default : true },
  },{ 
    timestamps : true
  }
);

schema.index({name:1, act : 1});

schema.statics = {
 
};


module.exports = mongoose.model(model_name,schema,model_name);