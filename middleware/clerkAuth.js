const isclerkLoggedIn = (req,res,next)=>{

    if(req.session.userInfo){
        if(req.session.userInfo.type="clerk"){
            next();
        }else{
            res.render("User/login",{
                error1: "Invalid account!!!"
            });
        }
        
    }else{
        res.render("User/login",{
            error1: "Invalid account!!!"
        });
    }
}

module.exports = isclerkLoggedIn;