import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import Order from '../models/order.model.js';

export const createReview = async (req, res) => {
    try {
      const { userId, productId, rating, reviewText } = req.body;
  
      // Check if the user has ordered the product and the order is delivered
      const userOrder = await Order.findOne({
        user: userId,
        'items.product': productId,
      });
  
      if (!userOrder) {
        return res.status(403).json({ message: 'You are not allowed to review this product. Ensure you have ordered and received the product.' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Ensure that the user.reviews array is initialized
      if (!user.reviews) {
        user.reviews = [];
      }
  
      // Check if the user has already reviewed the product
      const existingReview = await Review.findOne({ user: userId, product: productId });
  
      if (existingReview) {
        // If the user has already reviewed, update the existing review
        existingReview.rating = rating;
        existingReview.reviewText = reviewText;
  
        await existingReview.save();
  
        return res.status(200).json({ message: 'Review updated successfully.' });
      }
  
      // If the user has not reviewed, create a new review
      const newReview = new Review({
        user: userId,
        product: productId,
        rating,
        reviewText,
      });
  
      await newReview.save();
  
      user.reviews.push(newReview);
      await user.save();
  
      return res.status(201).json({ message: 'Review created successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
    }
  };
  

  export const getAllReviewsForProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
  
      // Find all reviews for the specified product
      const reviews = await Review.find({ product: productId });
  
      return res.status(200).json({ reviews });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };