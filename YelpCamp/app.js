
const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync')

const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/reviews')

mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost:27017/YelpCamp',
    {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    });


const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error!!"))
db.once('open', () => {
    console.log('MongoDB Connected')
})


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs') //helps to render ejs format
app.set('views', path.join(__dirname, 'views')) //Connects to the views dir

app.use(express.urlencoded({ extended: true })) //Parses the req.body from HTML
app.use(methodOverride('_method'))//Overriding POST method to other methods
app.use(express.static(path.join(__dirname, 'public'))); //Connect to the public folder
app.use(flash())

const sessionConfig = {
    secret: 'nopassword',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.get('/', (req, res) => {
    res.render('home')
})


app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRouter)
app.use('/campgrounds/:id/reviews', reviewRouter)


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