const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({ 
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    dataCreated:{
        type:Date,
        default:Date.now()
    },
    type:{
        type:String,
        default:"User"
    }
  
});

userSchema.pre("save",function(next){
    bcrypt.genSalt(10)
    .then((salt)=>{
        bcrypt.hash(this.password,salt)
        .then((encrytPassword)=>{
            this.password=encrytPassword;
            next();
        })
        .catch(err=>console.log(`Error during hashing`));
    })
    .catch(err=>console.log(`Error during the salting`));

}) 


const userModel = mongoose.model('User', userSchema);
    

module.exports = userModel; 
  