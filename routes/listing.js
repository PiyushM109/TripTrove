const express = require('express')
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const review = require('../models/review.js');
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})




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

router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
});

router.get("/:id", (req, res) => {
    let { id } = req.params;
    Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner").then((data) => {
        if (!data) {
            req.flash("error", "Listing you requested for does not exist");

            res.redirect("/listings");
        }
        else {

            res.render("./listings/show.ejs", { data });
        }

    }).catch(err => {
        next(new ExpressError(404, "Something went wrong please try again later!"))

    })
});

router.get("/:id/edit",isLoggedIn,isOwner,  (req, res, next) => {
    let { id } = req.params;
    Listing.findById(id).then((data) => {
        if (!data) {
            req.flash("error", "Listing you requested for does not exist");
            res.redirect("/listings");
        } else {
            res.render("./listings/edit.ejs", { data });
        }
    }).catch(err => {
        next(new ExpressError(404, "Page Not Found!"));
    })
})

router.post("/", isLoggedIn,upload.single('listing[image]'), wrapAsync(async (req, res) => {
    let url = await req.file.path;
    let name = await req.file.filename;
    const newListing = new Listing({
        title: req.body.listing.title,
        description: req.body.listing.description,
        image: {
            filename: name,
            url: url,
        },
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country,
        owner: req.user._id

    });
    await newListing.save();
    req.flash("success", "New Listing created!..")
    res.redirect("/listings");
})

);

router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'), async (req, res, next) => {
    let { id } = req.params;
    let temp = await Listing.findById(id);
    let url = temp.image.url;
    let name = temp.image.filename;
    console.log(req.file);
    if(typeof req.file !== "undefined"){
        url = await req.file.path;
        name = await req.file.filename;
    }

    let curr = req.body.listing;
    Listing.findByIdAndUpdate(id, {
        title: curr.title,
        description: curr.description,
        image: {
            filename: name,
            url: url,
        },
        price: curr.price,
        location: curr.location,
        country: curr.country

    }).then((data) => {
        req.flash("success", "Listing Updated")
        res.redirect(`/listings/${id}`);
    }).catch(err => {
        next(new ExpressError(404, "Page Not Found!"));
    });



});

router.delete("/:id",isLoggedIn,isOwner, async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let reviewarr = listing.reviews;
    for(let i = 0; i<reviewarr.length; i++){
        await review.findByIdAndDelete(reviewarr[i]);
    }
    Listing.findByIdAndDelete(id).then(() => {
        req.flash("success", "Listing deleted..");
        res.redirect("/listings");
    }).catch(err => {
        res.redirect(`/listings/${id}`);
    })
});

module.exports = router;
