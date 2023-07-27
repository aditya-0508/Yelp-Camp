const  mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'//it is a refernce to the user..
    }
});

module.exports=mongoose.model("Review",reviewSchema);