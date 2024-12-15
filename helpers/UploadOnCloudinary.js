import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'

const uploadOnCloudnary = async (buffer) => {
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
        api_key: process.env.CLOUDINARY_APIKEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });
    
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
            if(err) {
                return reject(err);
            } else {
                resolve(result);
            }
        })
        streamifier.createReadStream(buffer).pipe(uploadStream);
    })
}


export default uploadOnCloudnary;