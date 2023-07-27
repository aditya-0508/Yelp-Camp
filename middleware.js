const ExpressError=require('./utils/ExpressError');
const {campgroundSchema,reviewSchema}=require('./schemas.js');
const Campground=require('./models/campground');
const Review=require('./models/reviews');

//middleware for login
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //store the url they are requesting!,so that we directly get into the page that we want to request and not campground whcih we may not want.
        req.session.returnTo=req.originalUrl;//this returnTo will help in redirecting to the paeg what we were requesting..
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}

//this is the middleware for that returnTo part...(storeReturnTo)
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
//these are made so that the no way like postman any unauthorization can be made...

//describing the middleware
module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    console.log(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,404)
    }
    else{
        next();
    }
}

//we are making the middleware for that author permission stuff..
module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do have the permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

//making a middleware for review ka author 
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do have the permission')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

//describing the middleware for validating the review
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,404)
    }
    else{
        next();
    }
}

