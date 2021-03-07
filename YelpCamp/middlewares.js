const isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if(!req.isAuthenticated()){
        req.flash('error', "Must be Logged In")
        return res.redirect('/login')
    }
    next()
}

module.exports = {isLoggedIn};
