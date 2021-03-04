const express = require('express');
const router = express.Router({mergeParams: true}) //Merging parmas so that parmas from app.js can be used in this route
const mongoose = require('mongoose');

const Review = require('../models/reviews');
const Campground = require('../models/campGround')

const {reviewSchema} = require('../schemas.js')


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync')

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

router.post('/',validateReview, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const {review} = req.body;
    const newReview = new Review(review);
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    // console.log(campground)
    req.flash('success', 'You have posted your reveiw')
    res.redirect(`/campgrounds/${campground._id}`)
} ))


router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) 
    const removeReview = await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;