module.exports=func=>{
    return (req,res,next)=>{
        func(req,res,next).catch(next)
    }
}
//we return a function that accepts the function and execute the function and catches the error if any and passes to the next 
//we sort of use this to sort our functions 
//we can use to wrap any async function so that to handle any error if any happens 