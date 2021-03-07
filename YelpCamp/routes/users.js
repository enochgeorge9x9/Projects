const express = require('express')
const router = express.Router();
const passport = require('passport')

const catchAsync = require('../utils/catchAsync')

const User = require('../models/user');

const authenticateUser = passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' })


router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {

        return res.redirect('/campgrounds');

    }
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, username })
        const registerUser = await User.register(user, password)
        req.login(registerUser, err => {
            if (err) return next(err)
            req.flash('success', `Welcome to YelpCamp ${username}`)
            res.redirect('/campgrounds')
        })
        // console.log(registerUser)
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}))


router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    res.render('users/login')
})


router.post('/login', authenticateUser, (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    console.log(redirectUrl)
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!!')
    res.redirect('/campgrounds')
})


module.exports = router