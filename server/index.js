import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js'; 
import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js'
import productRouter from './routes/product.route.js'
import orderRouter from './routes/order.route.js'
import postRouter from './routes/post.route.js'


import cloudinary from 'cloudinary';
// import ProductRouter from './routes/product.route.js';

import cookieParser from "cookie-parser";
dotenv.config();


const app = express();

app.use(express.json())
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/post', postRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});
  

