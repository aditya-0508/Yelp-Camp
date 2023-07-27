//reafcatoring the campgrounds so that it can broken down into smaller routes
const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary');

module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground=async(req,res,next)=>{
    const campground=new Campground(req.body.campground);
    campground.images=req.files.map(f=>({url:f.path, filename: f.filename }))//req.files object is provided by the multer which processes the file to uploads and stores them temporarily on the server..    
    campground.author=req.user._id;//stores in the user_id when u create any campground
    await campground.save();
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({//it's a nested populate
       path:'reviews',//populate all the reviews from the review array on one campground we are finding 
       populate:{//populate on each one of them and there author 
           path:'author'
       }//so that the name of the author who has created the campground can be displayed.
   }).populate('author');//here we are populating the name of the author and also reviews to be displayed(seperately populating on that campgrounds)
   if(!campground){
       return res.redirect('/campgrounds');
   }
    res.render('campgrounds/show',{campground});
}

module.exports.renderEditForm=async(req,res)=>{//if the campground is present the we check if the campground is owned by him so that he can edit if not then permission id denied.
    req.flash('error','You do have the permission')
    const {id}=req.params;
     const campground=await Campground.findById(id)
     if(!campground){//first we check if that campground is present or not.
        return res.redirect('/campgrounds');
    }
     res.render('campgrounds/edit',{campground});
}

module.exports.updateCampground=async(req,res)=>{//in also it is added so any edit can't be done through ajax or postman
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs= req.files.map(f=>({url:f.path, filename: f.filename }));
    campground.images.push(...imgs);//u don't pass in the array instead u pass in the data of that array,here we are not overriding instead we are pushing in..
    await campground.save();
    if(req.body.deleteImages){//if there is anything to be deleted
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);//there is a method to destroy the uploaded file from the cloudinary 
        }
    campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})//we will update by deleting or pulling the image from the mongod and cloudinary whose filname matches with the filename of the deleteImages array 
    }
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground=async(req,res)=>{//so if he is not the owner of that campground he can't delete that 
    const {id}=req.params;
    const campground=await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}