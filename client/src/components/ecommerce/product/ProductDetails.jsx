import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiShoppingCart } from "react-icons/ci";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import "../../../loader.css";
import { FaStar } from "react-icons/fa6";

export default function ProductDetails() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate()
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
    dispatch(addToCart({ ...product, quantity }));
    console.log("Updated Cart:", cart);
  };

  if (loading) {
    return (
      <div className="hourglassBackground">
        {/* ... (loading spinner code) */}
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
      navigate('/')
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="col-span-1 p-6 bg-gray-100 rounded place-content-center sm:p-8">
            <div className="max-w-md mx-auto text-center lg:text-left">
              <header>
                <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                  {product.name}
                </h2>
                <p className="mt-4 text-gray-500">{product.description}</p>
              </header>
              <p className="mt-5 mb-5 text-sm text-gray-700">
                Price: $ {product.price}
              </p>

              <div>
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
                className="inline-block px-12 py-3 mt-8 text-sm font-medium text-white transition bg-gray-900 border border-gray-900 rounded hover:shadow focus:outline-none focus:ring"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>
          </div>

          <div className="col-span-2 py-8">
            <ul className="grid grid-cols-2 gap-4">
              <li>
                <a href="#" className="block group">
                  <img
                    src={product.imageUrls[0]}
                    alt=""
                    className="object-cover w-full rounded aspect-square"
                  />
                </a>
              </li>

              <li>
                <a href="#" className="block group">
                  <img
                    src={product.imageUrls[0]}
                    alt=""
                    className="object-cover w-full rounded aspect-square"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
        {reviews.length > 0 ? (
          <ul>
          {reviews.map((review) => (
  <li key={review._id}>
    <p className="flex align-baseline">
      <FaStar />{" "}
      {review.rating !== undefined ? review.rating : "N/A"}
    </p>
    <p>{review.reviewText || "No review text available"}</p>
  </li>
))}

          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
      <div className="container mx-auto">
        <form onSubmit={handleAddReview} className="mt-8">
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Review:
            <textarea
              className="mt-2 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </label>
          <br />
          <button
            type="submit"
            className="inline-block rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
          >
            Add Review
          </button>
        </form>
      </div>
    </section>
  );
}
