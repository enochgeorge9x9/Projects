
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync')
const Campground = require('./models/campGround')
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const ejsMate = require('ejs-mate');
const Review = require('./models/reviews');

mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost:27017/YelpCamp',
    {
        useUnifiedTopology: true,
        useCreateIndex: true
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error!!"))
db.once('open', () => {
    console.log('MongoDB Connected')
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs') //helps to render ejs format
app.set('views', path.join(__dirname, 'views')) //Connects to the views dir

app.use(express.urlencoded({ extended: true })) //Parses the req.body from HTML
app.use(methodOverride('_method'))//Overriding POST method to other methods

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
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


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground ,catchAsync(async (req, res, next) => {
    const newCampground = req.body.campground;
    const campground = new Campground({ ...newCampground });
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))



app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews')
    // console.log(campground)
    res.render('campgrounds/show', { campground })
}))


app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id',validateCampground ,catchAsync(async (req, res) => {
    const newCampground = req.body.campground;
    // console.log(req.body)
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...newCampground });
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))


app.post('/campgrounds/:id/reviews',validateReview, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const {review} = req.body;
    const newReview = new Review(review);
    campground.reviews.push(newReview);
    await campground.save();
    await newReview.save();
    // console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`)
} ))


app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) 
    const removeReview = await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error.ejs', { err })
})

app.listen(3000, (req, res) => {
    console.log('Listening on Port 3000'.toUpperCase())
})