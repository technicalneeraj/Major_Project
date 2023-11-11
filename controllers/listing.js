const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.rendernewform=(req,res)=>{
    // console.log(req.user);  //when login the all details stored here!!
    res.render("listings/new.ejs");
};

module.exports.showlisting=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","The listing you requested is not exists");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createlisting=async(req,res,next)=>{
    // let{title,description,price,image,location,country}=res.body;
    // console.log(req.body);
    // console.log(req.body.obj);
        // if(!req.body.obj){
        //     throw new ExpressError(400,"send valid data for listing");
        // }
    // let result=listingschema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
   let ans=await geocodingClient.forwardGeocode({
        query: req.body.obj.location,
        limit: 1
      })
        .send();
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting=new Listing(req.body.obj);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=ans.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","Listing is succesfully saved");
    res.redirect("/listings");
};

module.exports.editlisting=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","The listing you requested is not exists");
        res.redirect("/listings");
    }
    let originalurl=listing.image.url;
    originalurl=originalurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalurl});
};

module.exports.updatelisting=async (req,res)=>{
    let {id}=req.params;
    let ans=await geocodingClient.forwardGeocode({
        query: req.body.obj.location,
        limit: 1
      }).send();
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.obj});
    listing.geometry=ans.body.features[0].geometry;
    await listing.save();
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing is succesfully updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deletedlisting=async(req,res)=>{
    let {id}=req.params;
    let deletedlist=await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success","Listing was successfully deleted")
    res.redirect("/listings");
}

module.exports.filterslisting=async(req,res)=>{
    let {q}=req.query;
    let allListings=await Listing.find({category:q});
    res.render("listings/index.ejs",{allListings});
}