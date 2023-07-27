const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const campgrounds=require('../controllers/campgrounds');//here we are importing the controller so that the mvc part can be added(like breaking in the routes)
const Campground=require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');//importing the middlwares
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});//instead of loading the images in the uploads folder we would be doing that in the cloudinary 

router.route('/')//this helps in getting all the requests kind of stuff like get,put,post and all in just one only..
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground)); //upload.array is the multer middleware.
   // .post(upload.array('image'),(req,res)=>{//this will upload multiple files 
       // console.log(req.body,req.files);
       // res.send("It works");

//app.get('/makecampground',async (req,res)=>{
    //const camp=new Campground({title: 'My BackYard',description:"Cheap Camping"});//adding to database according to the schema given 
   // await camp.save();
    //res.send(camp);
//})

router.get('/new',isLoggedIn,campgrounds.renderNewForm)//yeh woh controller wala part ha 
 
//populate method allows to retrieve the refernced items with the actual items(Like in case with the author if the author is someone else than Adii it will replace with that Adii)
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));
 



module.exports=router;