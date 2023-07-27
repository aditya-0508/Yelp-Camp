const Review=require('../models/reviews.js');
const Campground=require('../models/campground');

module.exports.createReview=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);//used to search for a campground with a particular id ..
    const review=new Review(req.body.review);//Review is an another review model and req.body.review is used to populate the review object the rew.body consists of the necessary properties..
    review.author=req.user._id;//stores in the review given by the author 
    campground.reviews.push(review);//used to push the new review which is being created (thereby helping in storing the multiple reviews.)
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview=async(req,res)=>{//in this we want to do is remove that refernce to whatever the review is in the campground and we want to remove the review itself  
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})//here we are using the pull function of the mongoose to just take out only a particular review here we don't want to remove all the reviews only one particular should be removed only 
    await Review.findByIdAndDelete(reviewId);//this will delete that particular review but still in campground model the referenceto that particular will be present  will be still present 
    res.redirect(`/campgrounds/${id}`)
}