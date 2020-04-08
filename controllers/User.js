const express = require('express');
const router = express.Router();
//const model = require("../model/product");
const userModel = require("../model/User");
const path = require("path");


router.get("/cusRegistration",(req,res)=>{
    
    res.render("User/cusRegistration",{
        title : "Registration",
    });
});

router.get("/login",(req,res)=>{
    
    res.render("User/login",{
        title : "login in",
    });
});

router.get("/dashboard",(req,res)=>{
    res.render("User/dashboard",{
        title : "dashboard"
    });
});


router.post("/cusRegistration",(req,res)=>{

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
    userModel.findOne({email: req.body.email})
    .then(()=>{
        msgEM.push("This email has alreadly been registered");
    })

    if(msgRE.length > 0 || msgPW.length > 0 || msgEM > 0 || msgFN > 0){
        res.render("User/cusRegistration",{
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
        const newUser = {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        }
        const user = new userModel(newUser);
        user.save()
        .then(()=>{

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                //your personal key
            const msg = {
            to: `${newUser.email}`,
            from: `jackienleee@gmail.com`,
            subject: 'Welcome to our family',
            html: 
            `
            Hi, ${newUser.username} <br>
            Thank you for register our website, and be part of our family<br>
            You have success register with the email address: ${newUser.email} <br>
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
        })
        .catch(err=>console.log(`Error during inserting: ${err}`));
    
    }
}); 



router.post("/login",(req,res)=>{

    const message1 = [];
    if(req.body.email=="")
        message1.push("Please enter your Email.");
    const message2 = [];
    if(req.body.password=="")
        message2.push("Please enter your password.");


    if(message1.length > 0 || message2.length > 0){
        res.render("User/login",{
            title : "login in",
            error1 : message1,
            error2 : message2,
            email : req.body.email,
            password : req.body.password
        });
    }else{
        res.redirect("../");
    }
})

module.exports = router;