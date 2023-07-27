const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage} =require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
});

//Going to instantiate the instance of the cloudinary storage
const storage=new CloudinaryStorage({
    cloudinary,//we are passing in the cloudinary object in here .
    params:{
        folder:'YelpCamp',
        allowedFormats:['jpeg','jpg','png']
    }
})

module.exports={//here we are exporting both the instances 
    cloudinary,
    storage
}