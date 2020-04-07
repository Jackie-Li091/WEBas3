const express = require("express");
const exphbs = require('express-handlebars');
const model = require("./model/product");
const bodyParser = require('body-parser');
require('dotenv').config({path:"./config/keys.env"});

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/",(req,res)=>{

    res.render("home",{
        title : "Home",
        data : model.getCategory(),
        data1 : model.getAllBest()

    });
});

app.get("/products",(req,res)=>{

    res.render("products",{ //same name with the name of the handlebars
        title : "Product",
        data : model.getAllProduct()
    });
});

app.get("/cusRegistration",(req,res)=>{
    
    res.render("cusRegistration",{
        title : "Registration",
    });
});

app.get("/login",(req,res)=>{
    
    res.render("login",{
        title : "login in",
    });
});

app.get("/dashboard",(req,res)=>{
    res.render("dashboard",{
        title : "dashboard"
    });
});


app.post("/cusRegistration",(req,res)=>{

    const msgFN = [];
    const msgEM = [];
    const msgPW = [];
    const msgRE = [];
    
    if(req.body.username=="")
        msgFN.push("Please enter a First Name.");
    if(req.body.email=="")
        msgEM.push("Please enter an email.");
    let check = req.body.password;
    const regex = RegExp(/^[A-Za-z1-9]+$/);
    if(req.body.password.length>5 && req.body.password.length<13){   
        if(!regex.test(check))
            msgPW.push("Your password must only contain letters and numbers");
    }else{
        msgPW.push("Your password length must between 6-12.");
    }   
    if(req.body.passwordRE=="")
        msgRE.push("You need to enter the password again")
    if(req.body.passwordRE != check)
        msgRE.push("Should enter the same Password.");


    if(msgRE.length > 0 || msgPW.length > 0 || msgEM > 0 || msgFN > 0){
        res.render("cusRegistration",{
            title : "Registration",
            error : msgFN,
            error1 : msgEM,
            error2 : msgPW,
            error3 : msgRE,
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            passwordRE : req.body.passwordRE
        });
    }else{
        const {username,email} = req.body;
        const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            //your personal key
    const msg = {
      to: `${email}`,
      from: `jackienleee@gmail.com`,
      subject: 'Welcome to our family',
      html: 
      `
      Hi, ${username} <br>
      Thank you for register our website, and be part of our family<br>
      You have success register with the email address: ${email} <br>
      If it is not your work, please contact us.
      `,
    };

    sgMail.send(msg)
    .then(()=>{
        res.redirect("dashboard");
    })
    .catch(err=>{
        console.log(`Error ${err}`);
    })
        
    }
}); 

app.post("/login",(req,res)=>{

    const message1 = [];
    if(req.body.email=="")
        message1.push("Please enter your Email.");
    const message2 = [];
    if(req.body.password=="")
        message2.push("Please enter your password.");


    if(message1.length > 0 || message2.length > 0){
        res.render("login",{
            title : "login in",
            error1 : message1,
            error2 : message2,
            email : req.body.email,
            password : req.body.password
        });
    }else{
        res.redirect("/");
    }
})

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Web Server Started`);
});