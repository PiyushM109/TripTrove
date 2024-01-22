const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const User = require("./user.js");

const imageSchema = new Schema({
    filename: String,
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: function(v) {
        return v !== "" ? v : "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"; // Set the default value if empty
        }
    }
});

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: imageSchema, // Using a nested schema for image
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        default : "65968537aa0289fd4f35ba16",
        ref : "User",
    },
    geometry : {
        type:{
            type:String,
            default : "Point",
            enum :['Point'],
            required:true
        },
        coordinates:{
            type : [Number],
            default : [ 0,0 ],
            required : true
        }
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
