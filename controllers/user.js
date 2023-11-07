const User=require("../models/user.js");
module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newuser=new User({
        username:username,
        email:email
    });
    let newregistration=await User.register(newuser,password);
    console.log(newregistration);
    req.login(newregistration,(err,next)=>{
        if(err){
            return next(err);
        }
        req.flash("success","user successfully registered");
        res.redirect("/listings");
    });
}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to wonderlust");
    // res.redirect("/listings");
    let redirectUrl=res.locals.redirectUrl || "/listings"; //nhi toh listings par because in case of normal login isuserlogin not triggered and req.locals.redirecturl is not defined
    res.redirect(redirectUrl);
};

module.exports.rendersignupform=(req,res)=>{
    res.render("../views/Users/signup.ejs");
};

module.exports.renderloginform=(req,res)=>{
    res.render("../views/Users/login.ejs");
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","user logout successfully");
        res.redirect("/listings");       
    });
    
};