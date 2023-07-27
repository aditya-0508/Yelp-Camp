const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const mongoose=require('mongoose');
const Campground=require('../models/campground');
const axios = require('axios');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser:true})//use for the connection of the mongodb

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample=array=>array[Math.floor(Math.random()*array.length)];//making a function for the places and descriptors
const accesskey="MCcqAPk2lDOxiOoIIAlfj99UqHVxcFiKfYY9lWN20LY";
async function seedImg() {
  try {
    const width = 215; // Specify the desired width of the images
    const height = 150;
    const resp = await axios.get(`https://api.unsplash.com/search/photos?query=nature&client_id=${accesskey}&fit=crop&w=${width}&h=${height}`);
    const results = resp.data.results;
    const randomIndex = Math.floor(Math.random() * results.length);
    const smallUrl = results[randomIndex].urls.small;
    return smallUrl;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch image from Unsplash API');
  }
}


const seedDb=async()=>{//this is a function for adding title and location to the database(seeding the items into the database)
    await Campground.deleteMany({});//initially it deletes all the objects or the data present in the database 
    for(let i=0;i<50;i++){//producing 50 data 
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const image=await seedImg();
        const camp=new Campground({
            author:'64b6d082bd961aa285c07919',//by default
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex, earum!',
            price,
            images:[
              {
              url: 'https://res.cloudinary.com/dgf3ltds2/image/upload/v1690395259/YelpCamp/zcce6xjvlcirylfinqtb.jpg',
              filename: 'YelpCamp/zcce6xjvlcirylfinqtb'
            }
          ]
        })
        await camp.save();
    }
}

//this is used to close the connection once the data has been added to the database 
seedDb().then(()=>{
    mongoose.connection.close()
})