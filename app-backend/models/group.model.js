const mongoose             = require('mongoose');

const model_name = 'inventory';

const schema = mongoose.Schema({

    //name of group
    group_nm : {
        type        : String,
        required    : true
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

