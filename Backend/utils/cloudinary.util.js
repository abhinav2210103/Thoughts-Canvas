const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (dataURI) => {
  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    throw new Error('Cloudinary upload failed');
  }
};

module.exports = { uploadOnCloudinary };