const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')


const extension = (joi) => ({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHtml': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHtml : {
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHtml', {value})
            }
        }
    }
});

const Joi = baseJoi.extend(extension)

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHtml(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHtml(),
        description: Joi.string().required().escapeHtml(),    
    }).required(),
    deleteImages: Joi.array()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().escapeHtml()
    }).required()
})

module.exports = {campgroundSchema, reviewSchema};

