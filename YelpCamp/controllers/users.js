const User = require('../models/user');


//Renders Register Form
module.exports.renderRegister = (req, res) => {
    if (req.isAuthenticated()) {

        return res.redirect('/campgrounds');

    }
    res.render('users/register')
}

//Register the user in the Database
module.exports.register = async (req, res, next) => {
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
}


//Renders the Login Page
module.exports.renderLogin = async (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    //!Delete when fully complete
    const users = await User.find({})
    res.render('users/login', {users})
}

//Logins the user
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    // console.log(redirectUrl)
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}


//Logging Out the user
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!!')
    res.redirect('/campgrounds')
}