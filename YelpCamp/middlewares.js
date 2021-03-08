const { campgroundSchema, reviewSchema} = require('./schemas.js')
const Campground = require('./models/campGround')
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviews')


const isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.orginalUrl;
        req.flash('error', "Must be Logged In")
        return res.redirect('/login')
    }
    next()
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You don\'t have the permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

const isReviewAuthor = async(req, res, next) => {
    const {reviewId, id} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You don\'t have the permission to delete')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports = { isLoggedIn, validateCampground, isAuthor, validateReview, isReviewAuthor };
