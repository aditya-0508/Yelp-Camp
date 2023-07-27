const express=require('express');
const router=express.Router();//creates an instance of the Express router which is the middleware function capable of handling the routes and HTTP methods.
const catchAsync=require('../utils/catchAsync');
const passport=require('passport');
const User=require('../models/user');
const users=require('../controllers/users');
const { storeReturnTo } = require('../middleware');//like importing from the middleware function.. 

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));
//here we are registering a new user to the campgrounds

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)
//will flash a message in case of any error and redirect again back to the login page if the error exists ...
//this passport.authenticate is a middleware provided by passport itself...(here we are using the local strategy)

router.get('/logout',users.logout);

module.exports=router;

//passport provides us with login and logout function that can be used to establish a login session.passport.authenticate() middlware invokes req.login automatically
//this helps in resolving the problem of the once registering then again have the need of login again,which is tedious process.