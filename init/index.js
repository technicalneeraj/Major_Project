const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
const { deleteMany } = require("../models/listing");

const mongoose_URL="mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
    console.log("databse connected!!");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongoose_URL);
}
const initdb=async ()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6549328bd75cce832d948073"}));  //as map return a new array!!
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initdb();