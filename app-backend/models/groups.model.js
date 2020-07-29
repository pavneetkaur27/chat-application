const mongoose             = require('mongoose');

const model_name = 'groups';

const schema = mongoose.Schema({

    //name of group
    g_name: {
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

