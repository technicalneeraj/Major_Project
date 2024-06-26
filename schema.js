const Joi=require('joi');

module.exports.listingschema=Joi.object({
    obj:Joi.object({    //means ek object  ana hi chaiye jiska naam obj hoga!!
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        category: Joi.array().items(Joi.string()).min(1).required()
    }).required()
});

module.exports.reviewschema=Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
});