const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../schemas.js')
const Campground = require('../models/campGround')
const campgrounds = require('../controllers/campgrounds')

const { isLoggedIn, validateCampground, isAuthor } = require('../middlewares')



router.get('/', campgrounds.index)

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//Making new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground))


//show page
router.get('/:id', catchAsync(campgrounds.showCampground))

//edit page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderNewForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


module.exports = router;
