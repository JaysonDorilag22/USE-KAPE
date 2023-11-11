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
    type: Number, // Add a new field for quantity
    default: 0,   // Set a default value, if needed
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: true,
  },
  images: [new mongoose.Schema({ 
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  })],
});

const Product = mongoose.model('Product', productSchema);

export default Product;
