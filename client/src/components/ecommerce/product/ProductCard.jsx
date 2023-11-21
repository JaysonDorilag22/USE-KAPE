import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineArrowRightAlt } from "react-icons/md";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

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
  }, []);

  const addToCart = (productId) => {
    const productInCart = cart.find((item) => item._id === productId);
    let selectedProduct;

    if (productInCart) {
      const updatedCart = cart.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      console.log("Updated Cart (if product exists):", updatedCart);
      setCart(() => updatedCart); // Use functional form of setCart
    } else {
      selectedProduct = products.find((item) => item._id === productId);
      const updatedCart = [...cart, { ...selectedProduct, quantity: 1 }];
      console.log("Updated Cart (if product does not exist):", updatedCart);
      setCart(() => updatedCart); // Use functional form of setCart
    }

    // Update local storage using the updated state
    localStorage.setItem("cartItems", JSON.stringify(cart));

    // Log the current cart in local storage
    console.log(
      "Cart in Local Storage:",
      JSON.parse(localStorage.getItem("cartItems"))
    );
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
        <div className="mt-16  grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
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
                <a
                  className="flex justify-between items-center group-hover:text-slate-600"
                  onClick={() => addToCart(product._id)}
                >
                  <button
                    type="button"
                    className="inline-block rounded border-2 border-primary-100 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                    data-te-ripple-init
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
