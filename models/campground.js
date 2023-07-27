const mongoose = require('mongoose');
const Review=require('./reviews')
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png (for refernce)

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {//here we are using the cloudinary image tranformation api part thereby helping 
    return this.url.replace('/upload', '/upload/w_200');//in replacing the existing file with the new file with new modifications.
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'//alows to populate the author for campground by refernecing the author model..
    },
    reviews:[//an array consists the mutliple reviews given...
        {
            type:Schema.Types.ObjectId,//here objectid is stored so that instead of storing the whole review object it will just contain the objectid of that ecah review ...
            ref:'Review'//helps to establish a relationship between campground and review model .Allows to populate the reviews for a campground by referencing the Review model
        }
    ]
});
//here we are trying to successfully delete the associated reviews with respect to that campgrounds using the mongoose middleware
//here we are using the query middleware 
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({//we are trying to delete the review id which is somewhere in our doc.reviews
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
//here in that CampgroundSchema.post we are trying to delete the middleware
//as we are using the findByDeleteAndDelete in app.js we can only use the findOneAndDelete middleware only 