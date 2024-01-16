if(process.env.NODE_ENV!=="production"){//process.env is the an environment variable that is usually used just for the development or production.
    require('dotenv').config();
}


//console.log(process.env.SECRET)

const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const mongoSanitize=require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const dbUrl='mongodb://127.0.0.1:27017/yelp-camp'

const UserRoutes=require('./routes/users');
const campgroundsRoutes=require('./routes/campgrounds');
const reviewsRoutes=require('./routes/reviews');

//use for the connection of the mongodb
//'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl,{
    useNewUrlParser:true})

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

//Express Specific Stuff
const app=express();

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))//here we are serving the static files of public directory..
app.use(mongoSanitize({
    replaceWith:'_'
}))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error",function(e){
    console.log("Session Store Error",e)
})

const sessionConfig={
    store,
    name:'session',
    secret:'thisshouldbeabettersecret',
    resave:false,//these were for session deprecation for doubt check docs of webd
    saveUninitialized:true,
    cookie:{
        httpOnly:true,//httpOnly so that if the flag is included on a cookie,that cookie that cannot be accessed through the client side scripts
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,//so that the cookie expires in a week also the date.now gives the time in millisec so that's why that calculation is present..
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//authenticate is static methods of the passport-local-mongoose that generates Passport's LocalStrategy

passport.serializeUser(User.serializeUser());//it is to get a user into the session
passport.deserializeUser(User.deserializeUser());//to get a user out of the session..

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser=req.user;//this is for single template if the currentsuer is login or not.(req.user will give the session id and the username and rest things)
    res.locals.success=req.flash('success');//we have access to every single template..
    res.locals.error=req.flash('error');
    next();
})

app.use('/',UserRoutes);
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);//here that mergeparams part comes in as we are taking the /:id in this case..


app.get('/',(req,res)=>{
    res.render('home')//to render an HTML view and to send the rendered HTML data to the client 
});

//for any kind of requests,to handle error
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const{statuscode=500}=err;
    if(!err.message) err.message='Oh No,Something Went '
    res.status(statuscode).render('error',{err})//so that to display that  
})

app.listen(80,()=>{
    console.log("Serving at port 3000")
})
