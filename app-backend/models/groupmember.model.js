const mongoose             = require('mongoose');

const model_name = 'inventory';

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


// db.inventory.insert({product_nm : "Kurti",product_desc : "tetsingggggggg",actual_price : 30000, offered_price: 20000, discount: 10000, total_stock:10, is_product_avail: true, one_time_order_quant: 3,act: true })