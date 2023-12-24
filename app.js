const express = require("express");
const mongoose = require("mongoose");
const app = express();

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

app.listen(3000,()=>{
    console.log("App is running on port number 3000");
})