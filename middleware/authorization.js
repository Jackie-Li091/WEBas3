const isHighLevel = (req,res,next)=>{
    if(req.session.userInfo.userType=="clerk"){
        res.render("User/clerkDashboard");
    }else{
        res.render("User/userDashboard");
    }
}

module.exports = isHighLevel;