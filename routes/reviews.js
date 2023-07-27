const express=require('express');
const router=express.Router({mergeParams:true});//here mergeParams is used to /campgrounds/:id so that this part can be merged with the id's, this is not required in campgrounds the /:id is still present so taht part of mergingparams is not required...
const Review=require('../models/reviews.js');
const Campground=require('../models/campground');
const catchAsync=require('../utils/catchAsync');
const reviews=require('../controllers/reviews');
const ExpressError=require('../utils/ExpressError');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))

//the owner of that review can only delete that particular review.
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports=router;

//pull opeartor of the mongoose will take the id and remove any items which are present in that particular array
//in that delete part ,we are removing the reference to this review from the reviews array  and then we delete the entire review 
/*app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);//used to search for a campground with a particular id ..
    const review=new Review(req.body.review);//Review is an another review model and req.body.review is used to populate the review object the rew.body consists of the necessary properties..
    campground.reviews.push(review);//used to push the new review which is being created (thereby helping in storing the multiple reviews.)
    review.save();
    campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res)=>{//in this we want to do is remove that refernce to whatever the review is in the campground and we want to remove the review itself  
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})//here we are using the pull function of the mongoose to just take out only a particular review here we don't want to remove all the reviews only one particular should be removed only 
    await Review.findByIdAndDelete(reviewId);//this will delete that particular review but still in campground model the referenceto that particular will be present  will be still present 
    res.redirect(`/campgrounds/${id}`)
}))*/