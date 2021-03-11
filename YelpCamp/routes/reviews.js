const express = require('express');
const router = express.Router({ mergeParams: true }) //Merging parmas so that parmas from app.js can be used in this route
const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares')
const catchAsync = require('../utils/catchAsync')



router.post('/', isLoggedIn,
    validateReview,
    catchAsync(reviews.createReview))


router.delete('/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReview))

module.exports = router;