import cloudinary from 'cloudinary';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createPost = async (req, res) => {
  try {
    const { userId, description, imageUrls } = req.body;
    const user = await User.findById(userId);

    // Upload each image to Cloudinary and get secure URLs
    const uploadedImages = await Promise.all(
      imageUrls.map(async (imageUrl) => {
        const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
          folder: 'posts', // Set your desired folder name
        });
        return uploadedImage.secure_url;
      })
    );

    const newPost = new Post({
      user: userId,
      username: user.username,
      description,
      imageUrls: uploadedImages, // Store the secure URLs from Cloudinary
      likes: new Map(),
      comments: [],
    });

    await newPost.save();

    const post = await Post.findById(newPost._id);
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

  
  /* READ */
  export const getFeedPosts = async (req, res) => {
    try {
      const post = await Post.find();
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  /* UPDATE */
  export const likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const post = await Post.findById(id);
      const isLiked = post.likes.get(userId);
  
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  export const editPost = async (req, res) => {
    try {
      const { id } = req.params;
      const { description, imageUrls } = req.body;
  
      // Check if the post exists
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Check if the user is the owner of the post
      if (existingPost.user.toString() !== req.user.id) {
        return res.status  (403).json({ message: 'You do not have permission to edit this post' });
      }
  
      // Upload new images to Cloudinary if provided
      let updatedImages = [];
      if (imageUrls && imageUrls.length > 0) {
        updatedImages = await Promise.all(
          imageUrls.map(async (imageUrl) => {
            const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
              folder: 'posts', // Set your desired folder name
            });
            return uploadedImage.secure_url;
          })
        );
      }
  
      // Replace the existing images with the new ones
      existingPost.imageUrls = updatedImages;
  
      // Update the post description
      existingPost.description = description || existingPost.description;
  
      const updatedPost = await existingPost.save();
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  export const deletePost = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the post exists
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Check if the user is the owner of the post
      if (existingPost.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You do not have permission to delete this post' });
      }
  
      // Delete the post
      await Post.findByIdAndDelete(id);
  
      res.status(204).send(); // No content status for successful deletion
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  

