const express = require('express')
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}

router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`)
}));

router.delete("/:rev_id", wrapAsync(async(req,res)=>{
    let {id,rev_id}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:rev_id}})
    await Review.findByIdAndDelete(id);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;