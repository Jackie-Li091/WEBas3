const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({ 
    userId: {
        type:String,
        required:true
    },
    productId: {
        type:String,
        required:true
    },
    productName: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    quantity: {
        type:Number,
        required:true
    },
    existQuantity: {
        type:Number,
        required:true
    },
    productImg: {
        type:String
    },
    dataCreated:{
        type:Date,
        default:Date.now()
    }
  
});



const cartModel = mongoose.model('Cart', cartSchema);
    

module.exports = cartModel; 