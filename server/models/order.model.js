import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      imageUrls: {
        type: Array,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    recievername: {
      type: String,
      required: true,
    },
  },
  deliveryOption: {
    type: String,
    enum: ['Delivery', 'Pickup'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Processing','Shipped','Delivered','Cancelled'],
    default: 'Processing',
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Online Payment'],
    default: 'COD',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
