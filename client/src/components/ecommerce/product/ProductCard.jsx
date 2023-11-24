import { useEffect, useState } from "react";
import axios from "axios";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [sortBy, setSortBy] = useState("");
  // Update the `useEffect` that fetches products to apply sorting
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product/products");
        let sortedProducts = response.data;

        if (sortBy === "price-HIGH-LOW") {
          sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "price-LOW-HIGH") {
          sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
        }

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortBy]);

  useEffect(() => {
    // Update local storage whenever cart changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Corrected handleAddToCart function
  const handleAddToCart = (product) => {
    // Pass the entire product object to addToCart action
    dispatch(addToCart(product));
    console.log("Updated Cart:", cart);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Product Collection
          </h2>
          <p className="mt-4 max-w-md text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque
            praesentium cumque iure dicta incidunt est ipsam, officia dolor
            fugit natus?
          </p>
        </header>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex rounded border border-gray-100">
            <button className="inline-flex h-10 w-10 items-center justify-center border-e text-gray-600 transition hover:bg-gray-50 hover:text-gray-700">
              {/* Your SVG for the first button */}
            </button>

            <button className="inline-flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-50 hover:text-gray-700">
              {/* Your SVG for the second button */}
            </button>
          </div>

          <div>
            <label htmlFor="SortBy" className="sr-only">
              SortBy
            </label>
            <select
              id="SortBy"
              className="h-10 rounded border-gray-300 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price-HIGH-LOW">Price, High to Low</option>
              <option value="price-LOW-HIGH">Price, Low to High</option>
            </select>
          </div>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product._id}>
              <a className="group block overflow-hidden">
                <img
                  src={product.imageUrls[0]}
                  alt={`product-${product._id}`}
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="relative bg-white pt-3">
                  <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    {product.name}
                  </h3>

                  <p className="mt-2">
                    <span className="sr-only"> Regular Price </span>
                    <span className="tracking-wider text-gray-900">
                      $ {product.price}
                    </span>
                  </p>
                  <button
                    className="absolute top-2 right-2 text-gray-700 group-hover:text-gray-900"
                    onClick={() => handleAddToCart(product)}
                  >
                    <CiShoppingCart size={24} />
                  </button>
                </div>
              </a>
              <Link to={`/product/${product._id}`}>
                <button
                  className="mt-2 w-full rounded border border-slate-600 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500"
                >
                  View
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
