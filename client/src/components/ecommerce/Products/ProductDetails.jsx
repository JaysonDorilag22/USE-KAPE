import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiShoppingCart } from "react-icons/ci";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import "../../../loader.css";
import { FaStar } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductDetails() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const cart = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  console.log("currentuser:", currentUser._id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/get/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/order/reviews/${productId}`);
        setReviews(response.data.reviews);
      toast.success("Thank you for reviews nd ratings");
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    // Update local storage whenever cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = () => {
 
    if (product.quantity <= 0) {

      toast.error("This item is currently out of stock.");
      return;
    }

    dispatch(addToCart({ ...product, quantity }));
    console.log("Updated Cart:", cart);
  };


  if (loading) {
    return (
      <div className="hourglassBackground">
        <div className="hourglassContainer">
        <div className="hourglassCurves"></div>
        <div className="hourglassCapTop"></div>
        <div className="hourglassGlassTop"></div>
        <div className="hourglassSand"></div>
        <div className="hourglassSandStream"></div>
        <div className="hourglassCapBottom"></div>
        <div className="hourglassGlass"></div>
      </div>
      </div>
    );
  }

  const handleAddReview = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/order/reviews", {
        userId: currentUser._id,
        productId,
        rating,
        reviewText,
      });

      console.log("Server response:", response.data);
      console.log("Server response:", response);
      // Update the UI with the new review
      setReviews([...reviews, response.data.review]);
      // Clear the input fields
      setRating(5);
      setReviewText("");
      navigate("/");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              {product.imageUrls.slice(0, 4).map((imageUrl, index) => (
                <div key={index}>
                  <img
                    className="h-auto max-w-full rounded-lg"
                    src={imageUrl}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center bg-gray-100">
            <span className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100"></span>

            <div className="p-8 sm:p-16 lg:p-24">
              <h2 className="text-2xl font-bold sm:text-3xl">{product.name}</h2>

              <p className="mt-4 text-gray-600">{product.description}</p>
              <p className="mt-4 text-gray-600">Price: ${product.price}</p>

              <div className="mt-3">
                <label htmlFor="Quantity" className="sr-only">
                  Quantity
                </label>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="w-10 h-10 leading-10 text-gray-600 transition hover:opacity-75"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    &minus;
                  </button>

                  <input
                    type="number"
                    id="Quantity"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value, 10)))
                    }
                    className="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <button
                    type="button"
                    className="w-10 h-10 leading-10 text-gray-600 transition hover:opacity-75"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    &#43;
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-8 inline-block rounded border border-slate-600 bg-slate-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-slate-600 focus:outline-none focus:ring active:text-slate-500"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="stroke-slate-800"></hr>

      <div className="mx-auto mt-8 p-10">
        <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review._id} className="mb-4">
                <div className="flex items-baseline mb-2">
                  <p>{review.user.name}</p>
                  <FaStar className="text-yellow-500" />{" "}
                  <p className="ml-1">
                    {review.rating !== undefined ? review.rating : "N/A"}
                  </p>
                </div>
                <p>{review.reviewText || "No review text available"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
      <hr className="stroke-slate-800"></hr>

      <div className="mx-auto mt-8 p-10">
        <form onSubmit={handleAddReview} className="mt-8">
          <label>
            Rating:
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  className={`text-yellow-500 cursor-pointer ${
                    value <= rating
                      ? "text-yellow-500 fill-current"
                      : "text-gray-300 stroke-current"
                  }`}
                  onClick={() => setRating(value)}
                />
              ))}
            </div>
          </label>

          <br />
          <p>Review:</p>
          <label>
            <textarea
              className="mt-2 w-full md:w-96 rounded-lg border-gray-200 border p-2 focus:outline-none focus:ring focus:border-indigo-600"
              placeholder="Enter your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </label>

          <br />

          <button
            type="submit"
            className="mt-8 inline-block rounded border border-slate-600 bg-slate-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-slate-600 focus:outline-none focus:ring active:text-slate-500"
          >
            Add Review
          </button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
