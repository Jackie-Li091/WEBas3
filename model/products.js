const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({ 
    title: {
        type:String,
        required:true
    },
    cate: {
        type:String,
        required:true
    },
    description: {
        type:String,
    },
    price: {
        type:Number,
        required:true
    },
    quantity: {
        type:Number,
        required:true
    },
    bestSeller: {
        type:Boolean,
        required:true
    },
    productImg: {
        type:String
    },
    isCate: {
        type:String,
        default:"false"
    },
    dataCreated:{
        type:Date,
        default:Date.now()
    }
  
});



const productModel = mongoose.model('Product', productSchema);
    

module.exports = productModel; 
  