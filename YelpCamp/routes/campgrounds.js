const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const {campgroundSchema} = require('../schemas.js')
const Campground = require('../models/campGround')
const ExpressError = require('../utils/ExpressError');

const {isLoggedIn} = require('../middlewares')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

router.get('/new',isLoggedIn,  (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn,  validateCampground ,catchAsync(async (req, res, next) => {
    const newCampground = req.body.campground;
    const campground = new Campground({ ...newCampground });
    await campground.save()
    req.flash('success', 'You have Successfully created a New Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))


//show page
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error', 'Sorry, this Campground does not exist')
        return res.redirect('/campgrounds')
    }
    // console.log(campground)
    res.render('campgrounds/show', { campground })
}))


router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Sorry, this Campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id',validateCampground ,catchAsync(async (req, res) => {
    const newCampground = req.body.campground;
    // console.log(req.body)
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...newCampground });
    req.flash('success', "You have Updated the Campground")
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted Campground')
    res.redirect('/campgrounds')
}))



module.exports = router;
