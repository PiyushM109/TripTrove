const Joi = require("joi");
module.exports.listingSchema = Joi.object({
    listing  : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().min(5).required(),
        image : Joi.string().allow("",null),
        price : Joi.number().min(0).required(),
        country : Joi.string().required(),
        location : Joi.string().required(),
        
        
    }).required
})