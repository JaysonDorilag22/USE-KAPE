import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart
} from "../../../redux/cart/cartSlice";
import { addOrder } from "../../../redux/cart/orderSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
console.log('User:', user);
const navigate = useNavigate();


  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    recievername:"",
  });

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart({ _id: productId }));
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(decreaseQuantity({ _id: item._id }));
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(increaseQuantity({ _id: item._id }));
  };

  const handleCheckout = async () => {
    try {
      if (!user || cart.length === 0) {
        console.error("User not logged in or cart is empty");
        return;
      }

      const orderData = {
        userId: user._id,
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          imageUrls: item.imageUrls,
        })),
        totalAmount: cart.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        ),
        shippingAddress,
        paymentMethod,
      };

      const response = await axios.post("/api/order/create", orderData);

      // Uncomment if you have a createOrder action
      // await dispatch(createOrder(response.data));

      console.log("Order placed successfully!");
      navigate('/sucess')
      dispatch(clearCart());

      // Redirect to success page or show success message
    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error: Display error message or redirect to the error page
    }
  };

  return (
    <div>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                Checkout
              </h1>
            </header>

            <div className="mt-8">
              <form className="mt-8">
                <form className="mt-8">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        onChange={handleInputChange}
                        value={shippingAddress.street}
                        required
                        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        onChange={handleInputChange}
                        value={shippingAddress.city}
                        required
                        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        onChange={handleInputChange}
                        value={shippingAddress.state}
                        required
                        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        onChange={handleInputChange}
                        value={shippingAddress.zip}
                        required
                        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name:
                      </label>
                      <input
                        type="text"
                        id="recievername"
                        name="recievername"
                        onChange={handleInputChange}
                        value={shippingAddress.recievername}
                        required
                        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="paymentMethod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        value={paymentMethod}
                        className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      >
                        <option value="COD">COD</option>
                        <option value="Online Payment">Online Payment</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full bg-gray-700 text-white py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </form>
            </div>

            {/* Display Cart Items */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ul>
                  {cart.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center justify-between border-b border-gray-300 py-2"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.imageUrls}
                          alt={item.title}
                          className="w-12 h-12 object-cover mr-4"
                        />
                        <div>
                          <p className="text-gray-800">{item.title}</p>
                          <p className="text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleDecreaseQuantity(item)}
                          className="text-red-500 mr-2"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          className="text-green-500 mr-2"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="text-gray-500"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
