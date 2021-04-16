const mongoose=require('mongoose')
const Review=require('./reviews')
const Schema=mongoose.Schema;
// https://res.cloudinary.com/enochyelpcamp/image/upload/w_100/v1615728474/YelpCamp/mknd8n5zx3pxawoz0k3r.jpg

const ImageSchema=new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200')
})

const opts={ toJSON: { virtuals: true } };

const CampgroundSchema=new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<b><a href="/campgrounds/${this._id}">${this.title}</a></b>
    <p>${this.description.substring(0,25)}...</p>`
})

//Triggers when findByIdAndDelete is excuted by mongoose from app.js
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    // console.log(campground)
    if (campground) {
        await Review.deleteMany({
            _id: { $in: campground.reviews }
        })
    }
})

const Campground=mongoose.model('Campground', CampgroundSchema)

module.exports=Campground;