const Campground = require('../models/campGround')


//Main page of Campgrounds
module.exports.index =  async (req, res) => {
    const campgrounds = await Campground.find({}).populate('author')
    res.render('campgrounds/index', { campgrounds })
}


//Rendering new form to create new campground
module.exports.renderNewForm =  (req, res) => {
    res.render('campgrounds/new')
}


//Creating a new Campground
module.exports.createNewCampground = async (req, res, next) => {
    const newCampground = req.body.campground;
    const campground = new Campground({ ...newCampground });
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'You have Successfully created a New Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

//Shows more details of a campground
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
         populate: {
             path:'author'
            }
        }).populate('author')
    if (!campground) {
        req.flash('error', 'Sorry, this Campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

//Render Edit Form to edit a campground
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, this Campground does not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

//Edit the current Campground
module.exports.editCampground = async (req, res) => {
    const newCampground = req.body.campground;
    // console.log(req.body)
    const { id } = req.params;
    const campUpdate = await Campground.findByIdAndUpdate(id, { ...newCampground });
    req.flash('success', "You have Updated the Campground")
    res.redirect(`/campgrounds/${id}`)
}


//Deleting a Campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted Campground')
    res.redirect('/campgrounds')
}
