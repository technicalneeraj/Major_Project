const listings=require("../routes/listing.js");
const express=require("express");
const router=express.Router();

const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingschema,reviewschema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isuserlogin,isOwner,validateListing}=require("../middleware.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });

const listingcontroller=require("../controllers/listing.js");

router.route("/")
    .get(wrapasync(listingcontroller.index))
    //request by hoppscotch
    .post(isuserlogin,upload.single('obj[image]'),validateListing,wrapasync(listingcontroller.createlisting));

//always be before /listings/:id otherewise new is deal as id
router.get("/new",isuserlogin,listingcontroller.rendernewform);

router.route("/:id")
    .get(wrapasync(listingcontroller.showlisting))
    //update route
    .put(isuserlogin,isOwner,upload.single('obj[image]'),validateListing,wrapasync(listingcontroller.updatelisting))
    //delte route
    .delete(isuserlogin,isOwner,wrapasync(listingcontroller.deletedlisting));


//edit route
router.get("/:id/edit",isuserlogin,isOwner,wrapasync(listingcontroller.editlisting));

module.exports=router;

