const express=require("express");
const router=express.Router({mergeParams:true});
const wrapasync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const {listingschema,reviewschema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const {validateReview,isuserlogin,isReviewAuthor}=require("../middleware.js");

const reviewcontroller=require("../controllers/review.js");

//review post route
router.post("/",isuserlogin,validateReview,wrapasync(reviewcontroller.createreview));

//review delete route
router.delete("/:reviewId",isuserlogin,isReviewAuthor,wrapasync(reviewcontroller.deletereview));

module.exports=router;