const mongoose = require('mongoose')
const Review = require('./reviews')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
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
})

//Triggers when findByIdAndDelete is excuted by mongoose from app.js
CampgroundSchema.post('findOneAndDelete', async function (campground) {
    // console.log(campground)
    if(campground){
        await Review.deleteMany({
            _id : {$in: campground.reviews}
        })
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema)

module.exports = Campground;