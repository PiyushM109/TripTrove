const express = require('express')
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");




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


router.get("/", (req, res, next) => {
    Listing.find({}).then(datas => {
        res.render("./listings/index.ejs", { datas });
    }).catch(err => {
        next(new ExpressError(404, "Page Not Found!"));
    })
});
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

router.get("/:id", (req, res) => {
    let { id } = req.params;
    Listing.findById(id).populate("reviews").then((data) => {
        // console.log(data);
        res.render("./listings/show.ejs", { data });
    }).catch(err => {
        next(new ExpressError(404, "Something went wrong please try again later!"))

    })
});

router.get("/:id/edit", (req, res, next) => {
    let { id } = req.params;
    Listing.findById(id).then((data) => {
        // console.log(data);
        res.render("./listings/edit.ejs", { data });
    }).catch(err => {
        next(new ExpressError(404, "Page Not Found!"));
    })
})

router.post("/", wrapAsync(async (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
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

router.delete("/listings/:id", (req, res) => {
    let { id } = req.params;
    Listing.findByIdAndDelete(id).then(() => {
        res.redirect("/listings");
    }).catch(err => {
        res.redirect(`/listings/${id}`);
    })
});

module.exports = router;
