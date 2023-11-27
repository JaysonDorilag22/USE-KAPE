import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import "../../../loader.css";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const cart = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);

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

    fetchProduct();
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

  return (
    <section>
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
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

          <div className="lg:col-span-2 lg:py-8">
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
    </section>
  );
}
