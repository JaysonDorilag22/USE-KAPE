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
});

const Product = mongoose.model('Product', productSchema);

export default Product;
