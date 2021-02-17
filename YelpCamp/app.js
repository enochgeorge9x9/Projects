
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Campground = require('./models/campGround')
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/YelpCamp',
    {
        useNewUrlParser: true,
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

app.post('/campgrounds', async (req, res) => {
    const newCampground = req.body.campground;
    const campground = new Campground({...newCampground});
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(campground)
    res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const newCampground = req.body.campground;
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...newCampground });
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(3000, (req, res) => {
    console.log('Listening on Port 3000'.toUpperCase())
})