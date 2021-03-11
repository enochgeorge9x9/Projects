const Review = require('../models/reviews');
const Campground = require('../models/campGround')

module.exports.createReview = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const {review} = req.body;
    const newReview = new Review(review);
    newReview.author = req.user._id;
    // console.log(newReview)
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    // console.log(campground)
    req.flash('success', 'You have posted your reveiw')
    res.redirect(`/campgrounds/${campground._id}`)
} 

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) 
    const removeReview = await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}