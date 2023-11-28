import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import ProductCard from "./ProductCard"; // Make sure to import ProductCard if it's not already imported
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import { useParams } from "react-router-dom";

const types = [
  "Espresso",
  "Americano",
  "Latte",
  "Cappuccino",
  "Macchiato",
  "Mocha",
  "Flat White",
  "Cortado",
  "Turkish Coffee",
  "Cold Brew",
];

const flavors = [
  "Regular/Classic",
  "Vanilla",
  "Caramel",
  "Hazelnut",
  "Chocolate",
  "Peppermint",
  "Pumpkin Spice",
  "Coconut",
  "Almond",
  "Irish Cream",
];

const sizes = ["small", "medium", "large"];

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByPrice, setSortByPrice] = useState("");
  const [sortByType, setSortByType] = useState("");
  const [sortByFlavor, setSortByFlavor] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const productsPerPage = 8;


  // Define or import the cart variable
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log("Updated Cart:", cart);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((prevSize) => prevSize !== size)
        : [...prevSizes, size]
    );
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const categoryResponse = await axios.get(
          `/api/category/get/${categoryId}`
        );
        const productResponse = await axios.get(
          `/api/product/get/byCategory/${categoryId}?page=${productsPerPage}`
        );
        setCategory(categoryResponse.data);

        if (page === 1) {
          setProducts(productResponse.data);
          setInitialProducts(productResponse.data);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...productResponse.data]);
        }

        if (productResponse.data.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error(
          `Error fetching products for category ${categoryId}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    fetchCategoryProducts();
  }, [categoryId, page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const filterProducts = () => {
      let filteredProducts = initialProducts;

      if (sortByPrice === "price-HIGH-LOW") {
        filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortByPrice === "price-LOW-HIGH") {
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
      }

      if (sortByType) {
        filteredProducts = filteredProducts.filter(
          (product) => product.type === sortByType
        );
      }

      if (sortByFlavor) {
        filteredProducts = filteredProducts.filter(
          (product) => product.flavor === sortByFlavor
        );
      }

      if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          selectedSizes.includes(product.size)
        );
      }

      setProducts(filteredProducts);
    };

    filterProducts();
  }, [sortByPrice, sortByType, sortByFlavor, selectedSizes, initialProducts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div>
      <h2 className="mt-3 text-xl font-bold text-gray-900 sm:text-3xl p-5">{category.name}</h2>
      <p className="mt-4 text-gray-500 p-5">{category.description}</p>

      <div className="m-5 mt-8 flex items-center justify-between">
        <div className="flex rounded border border-gray-100">
          <div className="relative mr-4">
            <label htmlFor="sortByPrice" className="sr-only">
              Sort by Price
            </label>
            <select
              id="sortByPrice"
              className="h-10 rounded border-gray-300 text-sm"
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
            >
              <option value="">Sort By Price</option>
              <option value="price-HIGH-LOW">Price, High to Low</option>
              <option value="price-LOW-HIGH">Price, Low to High</option>
            </select>
          </div>

          <div className="relative mr-4">
            <label htmlFor="sortByType" className="sr-only">
              Sort by Type
            </label>
            <select
              id="sortByType"
              className="h-10 rounded border-gray-300 text-sm"
              value={sortByType}
              onChange={(e) => setSortByType(e.target.value)}
            >
              <option value="">Sort By Type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label htmlFor="sortByFlavor" className="sr-only">
              Sort by Flavor
            </label>
            <select
              id="sortByFlavor"
              className="h-10 rounded border-gray-300 text-sm"
              value={sortByFlavor}
              onChange={(e) => setSortByFlavor(e.target.value)}
            >
              <option value="">Sort By Flavor</option>
              {flavors.map((flavor) => (
                <option key={flavor} value={flavor}>
                  {flavor}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            {sizes.map((size) => (
              <div key={size} className="mr-4">
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  className="mr-2"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                <label htmlFor={`size-${size}`}>{size}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-5">
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
              <button className="mt-2 w-full rounded border border-slate-600 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500">
                View
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
