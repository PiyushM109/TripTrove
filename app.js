const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");



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
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const validateListing = (req,res,next)=>{
//     let result = listingSchema.validate(req.body);
//     console.log(result.error.details);
//     if(result.error){
//         throw new ExpressError(400,result.error);
//     }
//     else{
//         next();
//     }

// }

const validateSchema = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("Hello from triptrove :)");
});

app.get("/listings", (req, res, next) => {
    Listing.find({}).then(datas => {
        res.render("./listings/index.ejs", { datas });
    }).catch(err => {
        next(new ExpressError(404, "Page Not Found!"));
    })
});
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

app.get("/listings/:id", (req, res) => {
    let { id } = req.params;
    Listing.findById(id).populate("reviews").then((data) => {
        // console.log(data);
        res.render("./listings/show.ejs", { data });
    }).catch(err => {
        next(new ExpressError(404, "Something went wrong please try again later!"))

    })
});

app.get("/listings/:id/edit", (req, res, next) => {
    let { id } = req.params;
    Listing.findById(id).then((data) => {
        // console.log(data);
        res.render("./listings/edit.ejs", { data });
    }).catch(err => {
        next(new ExpressError(404, "Page Not Found!"));
    })
})

app.post("/listings", wrapAsync(async (req, res, next) => {
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
})

);

app.put("/listings/:id", (req, res, next) => {
    let curr = req.body.listing;
    console.log(curr.price);
    let { id } = req.params;
    Listing.findByIdAndUpdate(id, {
        title: curr.title,
        description: curr.description,
        image: {
            filename: "listingimage",
            url: curr.image,
        },
        price: curr.price,
        location: curr.location,
        country: curr.country

    }).then((data) => {
        // console.log(data);
        res.redirect(`/listings/${id}`);
    }).catch(err => {
        // console.log(err);
        next(new ExpressError(404, "Page Not Found!"));
    });

});

app.delete("/listings/:id", (req, res) => {
    let { id } = req.params;
    Listing.findByIdAndDelete(id).then(() => {
        res.redirect("/listings");
    }).catch(err => {
        res.redirect(`/listings/${id}`);
    })
});

app.post("/listings/:id/reviews", validateSchema, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`)
}))


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

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render("error.ejs", { err });
})

app.listen(3000, () => {
    console.log("App is running on port number 3000");
})