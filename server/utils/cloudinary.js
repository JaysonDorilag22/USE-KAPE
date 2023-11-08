// import cloudinary from 'cloudinary';

// // Configure Cloudinary with your credentials from environment variables
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Function to upload an image to Cloudinary
// const uploadCategoryImage = async (category, image) => {
//   try {
//     const result = await cloudinary.v2.uploader.upload(image.path);

//     // Update the category's image.publicId with the Cloudinary public ID
//     category.image.publicId = result.public_id;

//     // Save the updated category with the Cloudinary image reference
//     const updatedCategory = await category.save();

//     return updatedCategory;
//   } catch (error) {
//     console.error('Error uploading image to Cloudinary:', error);
//     throw error;
//   }
// };

// export { uploadCategoryImage };
