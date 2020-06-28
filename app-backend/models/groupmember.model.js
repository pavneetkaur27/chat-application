const mongoose             = require('mongoose');

const model_name = 'groupmember';

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
    
    socket_id : {
        type : String
    },

    is_blocked : {
        type : Boolean,
        required : true
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
 
};


module.exports = mongoose.model(model_name,schema,model_name);
