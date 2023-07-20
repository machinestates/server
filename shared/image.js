require('dotenv').config();

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDataUrl(dataUrl) {
  return await cloudinary.uploader.upload(dataUrl,
    { width: 1200, height: 1200, gravity: 'auto', crop: 'fill' }
  );
}


module.exports = {
  uploadDataUrl
}