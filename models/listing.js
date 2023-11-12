//here we creating our first model named as listing which tells about the place!!
const mongoose=require("mongoose");
const Review=require("./reviews.js");
const listingschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    category:{
        type:[String],
        enum:["Trending","Bread & Breakfast","Amazing pools","Lake","BeachFront","OMG!","Design","Farms","Amazing views","No animals","Mountain views","Campaign area","Tropical","24*7 Water","Mosquito free"],
        required:true
    }
});

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;
