let Listing=require("./models/listing");
const Review=require("./models/reviews.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema,reviewschema}=require("./schema.js");

module.exports.isuserlogin=(req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","user must login first!!");
    return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentuser._id)){
        req.flash("error","You are not the owner");
        return res.redirect(`/listings/${id}`);  //if dont return than below part also worked!!
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentuser._id)){
        req.flash("error","You are not the owner of the review");
        return res.redirect(`/listings/${id}`);  //if dont return than below part also worked!!
    }
    next();
}