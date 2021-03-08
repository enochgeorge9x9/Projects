const express = require('express');
const router = express.Router({mergeParams: true}) //Merging parmas so that parmas from app.js can be used in this route

const Review = require('../models/reviews');
const Campground = require('../models/campGround')

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middlewares')

const catchAsync = require('../utils/catchAsync')



router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
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
} ))


router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) 
    const removeReview = await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;