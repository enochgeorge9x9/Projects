//?Deletes everything from the database and creates random data for testing the app
//! Don't run it when there is real data in the database


const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campGround')

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

const sample = array => (array[Math.floor(Math.random() * array.length)]); 


const seedDB = async () => {
    await Campground.deleteMany({});
    const rand1000 = Math.floor(Math.random() * 1000)
    const randPrice = Math.floor(Math.random() * 30)+10
    for(let i=0; i<=50; i++){
        const camp = new Campground({
            author: "6044af15a1dd0015985b30db",
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            image: 'https://source.unsplash.com/collection/158643',
            price: randPrice, 
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo assumenda quia porro neque ad officiis sint provident, ut placeat. Vel, saepe. Tempora expedita officiis asperiores magnam temporibus eos natus cupiditate?Maiores odio hic est ducimus dolores veritatis eligendi illo repudiandae, veniam nihil rerum incidunt deleniti laborum optio doloribus praesentium temporibus vitae quam, harum sapiente, exercitationem tempora animi alias! Quod, impedit."
        })
    await camp.save()
    }
    
} 

seedDB().then(() => {
    mongoose.connection.close()
})