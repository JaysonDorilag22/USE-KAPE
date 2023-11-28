import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart,
} from "../../../redux/cart/cartSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CheckoutSchema = Yup.object().shape({
  street: Yup.string().required("Street Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zip: Yup.string().required("ZIP Code is required"),
  recievername: Yup.string().required("Reciever name is required"),
  deliveryOption: Yup.string().required("Delivery Option is required"),
  paymentMethod: Yup.string().required("Payment Method is required"),
});

export default function Checkout() {

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

 
  const [loading, setLoading] = useState(false);


  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart({ _id: productId }));
    if (cart.length === 1) {

      navigate("/cart");
    }
  };

 
  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity({ _id: item._id }));
    } else {
      dispatch(removeFromCart({ _id: item._id }));
    }
  };


  const handleIncreaseQuantity = (item) => {
    dispatch(increaseQuantity({ _id: item._id }));
  };


  const handleCheckout = async (values) => {
    try {

      if (!user || cart.length === 0) {
        console.error("User not logged in or cart is empty");
        return;
      }

      setLoading(true);


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
        shippingAddress: values,
        deliveryOption: values.deliveryOption,
        paymentMethod: values.paymentMethod,
      };


      const response = await axios.post("/api/order/create", orderData);


      console.log("Order placed successfully!");
      toast.success("Order placed successfully!");
      navigate("/success");
      dispatch(clearCart());
    } catch (error) {
  
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again.");
    } finally {
 
      setLoading(false);
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
  
              <Formik
                initialValues={{
                  street: "",
                  city: "",
                  state: "",
                  zip: "",
                  recievername: "",
                  deliveryOption: "",
                  paymentMethod: "",
                }}
                validationSchema={CheckoutSchema}
                onSubmit={handleCheckout}
              >
                {({ isSubmitting }) => (
           
                  <Form className="mt-8">
                   
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    
                      <div>
                        <label
                          htmlFor="street"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Street Address
                        </label>
                        <Field
                          type="text"
                          id="street"
                          name="street"
                          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <ErrorMessage
                          name="street"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <Field
                          type="text"
                          id="city"
                          name="city"
                          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State
                        </label>
                        <Field
                          type="text"
                          id="state"
                          name="state"
                          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="zip"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ZIP Code
                        </label>
                        <Field
                          type="text"
                          id="zip"
                          name="zip"
                          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <ErrorMessage
                          name="zip"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="recievername"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reciever Name
                        </label>
                        <Field
                          type="text"
                          id="recievername"
                          name="recievername"
                          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <ErrorMessage
                          name="recievername"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="deliveryOption"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Delivery Option
                        </label>
                        <Field
                          as="select"
                          id="deliveryOption"
                          name="deliveryOption"
                          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        >
                          <option value="Delivery">Delivery</option>
                          <option value="Pickup">Pickup</option>
                        </Field>
                        <ErrorMessage
                          name="deliveryOption"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="paymentMethod"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Payment Method
                        </label>
                        <Field
                          as="select"
                          id="paymentMethod"
                          name="paymentMethod"
                          className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        >
                          <option value="COD">COD</option>
                          <option value="Online Payment">Online Payment</option>
                        </Field>
                        <ErrorMessage
                          name="paymentMethod"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-gray-700 text-white py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-blue-300 ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

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
                          type="button"
                          onClick={() => handleDecreaseQuantity(item)}
                          className="h-8 px-2 border border-r-0 border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                          -
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          id={`Qty-${item._id}`}
                          className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          readOnly
                        />

                        <button
                          type="button"
                          onClick={() => handleIncreaseQuantity(item)}
                          className="m-5 p-5 h-8 px-2 border border-l-0 border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                          +
                        </button>

                        <button
                          className="text-gray-600 transition hover:text-red-600"
                          onClick={() => handleRemoveFromCart(item._id)}
                        >
                          <span className="sr-only">Remove item</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
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
