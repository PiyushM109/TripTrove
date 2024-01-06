const Listing = require("./models/listing.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in"),
            res.redirect("/login");
    } else {
        next();
    }
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    else {
        res.locals.redirectUrl = "/listings";
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You dont have permission to perform this operation");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, rev_Id } = req.params;
    let Review = await review.findById(rev_Id);
    console.log(Review);
    if (res.locals.currUser && !Review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You dont have permission to perform this operation");
        return res.redirect(`/listings/${id}`)
    }
    next();
}