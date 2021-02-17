const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String
})

const Campground = mongoose.model('Campground', campGroundSchema)

module.exports = Campground;