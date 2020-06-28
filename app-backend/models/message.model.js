const mongoose             = require('mongoose');

const model_name = 'message';

const schema = mongoose.Schema({

    //group id from group model
    gid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
      
    // account id from account model
    aid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    msg : {
        type : String,
    },

    msg_type : {
        type : Number,
        required : true 
    },

    is_admin : {
        type : Boolean,
        default : false
    },

    //msg deleted by admin
    msg_del :{
        type : Boolean,
        default : false
    },
    
    // active attribute for soft deletion 
    act : {
        type : Boolean,
        default : true
    },

    },{ 
    timestamps : true
  }
);


schema.statics = {
    MESSAGE_TYPE : {
        TEXT    : 1,           
        IMAGE   : 2,
        AUDIO   : 3,
        VIDEO   : 4,

    }
};


module.exports = mongoose.model(model_name,schema,model_name);