const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res,next)=>{
    try//this has been made to effective look after the if the same username exists and then to flash the error and then return back to the login page again 
    {
        const {email,username,password}=req.body;
        const user=new User({email,username});
        const registeredUser=await User.register(user,password);//this creates whole new instance of the user and it takes the password and it hashes the password and stores in the salt.
        req.login(registeredUser,err=>{//we login them and then it is redirected so that 
            if(err) return next(err);
            req.flash('success',"Welcome to Yelp-Camp!!!");
            res.redirect('/campgrounds');
        });
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
}

module.exports.login=(req,res)=>{//adding the middleware function..
    req.flash('success','Welcome back');
    const redirectUrl=req.session.returnTo || '/campgrounds';//this will return to the page u want to go to directly..
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout= (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}