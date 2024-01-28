const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const Listing = require("./listing.js");



const userSchema = new Schema({
    email : {
        type:String,
        required:true
    },
    bookings : {
        type : Schema.Types.ObjectId,
        ref : "Listing"
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);