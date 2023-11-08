if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");



const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");


const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("databse connected!!");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    // await mongoose.connect(mongoose_URL);
    await mongoose.connect(dbUrl);
}

app.listen("8080",()=>{
    console.log("listening on the port 8080");
});


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const Store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});
Store.on("error",()=>{
    console.log("Error in session store");
});


const sessionOptions={
    Store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+14*24*60*60*1000, //in millisecond (date.now also gives time in millisecond) in 14days
        maxAge:7*24*60*60*1000,
        httpOnly:true //for security purposeto prevent from  cross scripting attacks
    }
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentuser=req.user;
    next();
});

app.use("/",users);
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
    // throw new ExpressError(404,"page not found!!");      //also valid!!
    next(new ExpressError(404,"page not found!!"));  
});

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!!"}=err;
    res.status(status).render("listings/error.ejs",{message});
});


app.get("/",(req,res)=>{
    // console.dir(req.cookies);
    res.send("working");
});
 
// const {listingschema,reviewschema}=require("./schema.js");
// const Review=require("./models/reviews.js");







// { listingschema } is the object destructuring syntax. It means "extract the listingschema property
// from the imported module and assign it to a variable named listingschema."






// const mongoose_URL="mongodb://127.0.0.1:27017/wonderlust";

// app.get("/demouser",async (req,res)=>{
//     let registeruser=new User({
//         email:"jetha12@gmail.com",
//         username:"ojasw"
//     });
//     let output=await User.register(registeruser,"password123");
//     res.send(output);
// });



// app.get("/testlisting",wrapasync(async (req,res)=>{
//     let samplelisting=new Listing({
//     title:"titanic",
//     description:"he is very well known place",
//     price:1200,
//     location:"goa",
//     country:"india"
//     });
//     await samplelisting.save();
//     console.log("succesfully saved");
//     res.send("done");
// }));



