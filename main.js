const express = require("express");
const exphbs = require('express-handlebars');
//const model = require("./model/product");
const bodyParser = require('body-parser');
require('dotenv').config({path:"./config/keys.env"});
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');


const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const generalRoutes = require("./controllers/General.js");
const productRoutes = require("./controllers/Product.js");
const userRoutes = require("./controllers/User.js");

app.use((req,res,next)=>{
    if(req.query.method=="PUT"){
        req.method="PUT"
    }else if(req.query.method=="DELETE"){
        req.method="DELETE"
    }

    next();
}); 

app.use(fileUpload());

app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
}));

app.use((req,res,next)=>{
    
    res.locals.user=req.session.userInfo;
    
    next();
});


app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/product",productRoutes);
app.use("/",(req,res)=>{
    res.render("General/404");
});


mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connect to MonoDB Database`)
})
.catch(err=>console.log(`Error connecting`))


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Web Server Started`);
});