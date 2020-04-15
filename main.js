const express = require("express");
const exphbs = require('express-handlebars');
//const model = require("./model/product");
const bodyParser = require('body-parser');
require('dotenv').config({path:"./config/keys.env"});
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');


const app = express();

var hbs = exphbs.create({
    helpers: {
        if_eq: function(v1,v2,options){
            //console.log(v1,v2);
            if(v1 == v2)
                return options.fn(this);
            else
                return options.inverse(this);
        },
        if_higher: function(v1,v2,options){
            if(v1 > v2)
                return options.fn(this);
            else
                return options.inverse(this);
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

/*
app.engine(".hbs",exphbs({extname: ".hbs"}));
app.set("view engine", ".hbs");
var hbs = exphbs.create({});

hbs.handlebars.registerHelper("if_eq",function(value){

});
*/

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const generalRoutes = require("./controllers/General.js");
const productRoutes = require("./controllers/Product.js");
const userRoutes = require("./controllers/User.js");
const cartRoutes = require("./controllers/Cart");

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
app.use("/cart",cartRoutes);
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