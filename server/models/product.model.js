import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  imageUrls: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  flavor: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true,
  },
},
{ timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
