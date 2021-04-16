const Campground = require('../models/campGround')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})


//Main page of Campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}).populate('author').sort({ _id: 'desc' })
    res.render('campgrounds/index', { campgrounds })
}


//Rendering new form to create new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}


//Creating a new Campground
module.exports.createNewCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = req.body.campground;
    const campground = new Campground({ ...newCampground });
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    // console.log(campground)
    req.flash('success', 'You have Successfully created a New Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

//Shows more details of a campground
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
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
    const { id } = req.params;
    const campUpdate = await Campground.findByIdAndUpdate(id, { ...newCampground });
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campUpdate.images.push(...img);
    await campUpdate.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        } 
            await campUpdate.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
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
