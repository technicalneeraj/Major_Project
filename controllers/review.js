const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");

module.exports.createreview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("saved");
    req.flash("success","review is succesfully added");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.deletereview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review is succesfully deleted");
    res.redirect(`/listings/${id}`);
}