const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");

main().then(()=>{
    console.log("Successfully connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/TripTrove")
}

app.get("/",(req,res)=>{
    res.send("Hello from triptrove :)");
});

app.get("/testListing",(req,res)=>{
    let smapleListing = new Listing({
        title : "My Villa",
        description  : "By the beach",
        price : 1200,
        location  : "Clangute Goa",
        country : "India"
    });
    smapleListing.save().then((data)=>{
        res.send(data);
    }).catch((err)=>{
        throw new Error(err);
    })
})

app.listen(3000,()=>{
    console.log("App is running on port number 3000");
})