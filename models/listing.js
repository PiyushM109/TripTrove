const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: {
            filename: String,
            url: {
                type: String,
                default: "https://unsplash.com/photos/blue-outdoor-pool-hDbCjHNdF48",
                set: (v) => v === "" ? "https://unsplash.com/photos/blue-outdoor-pool-hDbCjHNdF48" : v,
            }
        },

    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;