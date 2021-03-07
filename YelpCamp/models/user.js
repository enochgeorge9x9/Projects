const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose') //For Authentication and ease to use with mongoose


const UserSchema = Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose); //Adds username, password, hash and salt to the UserSchema

const User = mongoose.model('User', UserSchema)

module.exports = User