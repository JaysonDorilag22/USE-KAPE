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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: true,
  },
  images: [new mongoose.Schema({ // Define the image subdocument directly here
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  })],
  // You can add more fields as needed for your ecommerce website, such as inventory, ratings, etc.
});

const Product = mongoose.model('Product', productSchema);

export default Product;
