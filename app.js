const express = require("express");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const path = require("path");


main().then(() => {
    console.log("Successfully connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/TripTrove")
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Hello from triptrove :)");
});

app.get("/listings", (req, res) => {
    Listing.find({}).then(datas => {
        res.render("./listings/index.ejs", { datas });
    }).catch(err => {
        console.log(err);
    })
});
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", (req, res) => {
    let { id } = req.params;
    Listing.findById(id).then((data) => {
        // console.log(data);
        res.render("./listings/show.ejs", { data });
    }).catch(err => {
        res.send("Something went wrong please try agian later");
    })
});

app.get("/listings/:id/edit", (req, res) => {
    let { id } = req.params;
    Listing.findById(id).then((data) => {
        // console.log(data);
        res.render("./listings/edit.ejs", { data });
    }).catch(err => {
        res.send("Something went wrong please try agian later");
    })
})

app.post("/listings", async (req, res) => {
    // console.log(req.body.listing);
    const newListing = new Listing({
        title: req.body.listing.title,
        description: req.body.listing.description,
        image: {
            filename: "listingimage",
            url: req.body.listing.image,
        },
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country,

    });
    await newListing.save();
    res.redirect("/listings");
});

app.put("/listings/:id",(req,res)=>{
    let curr = req.body.listing;
    console.log(curr.price);
    let { id } = req.params;
    Listing.findByIdAndUpdate(id,{
        title : curr.title,
        description : curr.description,
        image : {
            filename: "listingimage",
            url: curr.image,
        },
        price : curr.price,
        location : curr.location,
        country : curr.country

    }).then((data)=>{
        // console.log(data);
        res.redirect(`/listings/${id}`);
    }).catch(err => {
        // console.log(err);
        res.send("Something went wrong");
    });

});

app.delete("/listings/:id",(req,res) => {
    let {id} = req.params;
    Listing.findByIdAndDelete(id).then(()=>{
        res.redirect("/listings");
    }).catch(err=> {
        res.redirect(`/listings/${id}`);
    })
});


// app.get("/testListing",(req,res)=>{
//     let smapleListing = new Listing({
//         title : "My Villa",
//         description  : "By the beach",
//         price : 1200,
//         location  : "Clangute Goa",
//         country : "India"
//     });
//     smapleListing.save().then((data)=>{
//         res.send(data);
//     }).catch((err)=>{
//         throw new Error(err);
//     })
// })

app.listen(3000, () => {
    console.log("App is running on port number 3000");
})