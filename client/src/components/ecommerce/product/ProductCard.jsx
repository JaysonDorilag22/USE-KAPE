import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    // Update local storage whenever cart changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Corrected handleAddToCart function
  const handleAddToCart = (product) => {
    // Pass the entire product object to addToCart action
    dispatch(addToCart(product));
    console.log('Updated Cart:', cart);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
    <div className="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
      <div>
        <span className="text-gray-600 text-lg font-semibold">
          Product Features
        </span>
        <h2 className="mt-4 text-2xl text-gray-900 font-bold md:text-4xl">
          Explore our products
        </h2>
      </div>
      <div className="mt-16 grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative group bg-white transition hover:z-[1] hover:shadow-2xl"
          >
            <div className="relative p-8 space-y-8">
              {product.imageUrls[0] && (
                <img
                  src={product.imageUrls[0]}
                  className="w-10"
                  width="512"
                  height="512"
                  alt={`product-${product._id}`}
                />
              )}
              <div className="space-y-2">
                <h5 className="text-xl text-gray-800 font-medium transition group-hover:text-slate-600">
                  {product.name}
                </h5>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
              {/* Daisy UI Button styles applied directly in JSX */}
              <a className="flex justify-between items-center group-hover:text-slate-600">
                <button
                  type="button"
                  className="inline-block rounded border-2 border-primary-100 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10 daisyui-btn" // Add Daisy UI button class (e.g., daisyui-btn)
                  onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </button>
                <span className="-translate-x-4 opacity-0 text-2xl transition duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <MdOutlineArrowRightAlt />
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
