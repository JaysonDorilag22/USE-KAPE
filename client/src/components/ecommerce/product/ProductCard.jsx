import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineArrowRightAlt } from "react-icons/md";

export default function ProductCard() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    // You might want to render a loading spinner or message here
    return <div>Loading...</div>;
  }

  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
        <div>
          <span className="text-gray-600 text-lg font-semibold">Product Features</span>
          <h2 className="mt-4 text-2xl text-gray-900 font-bold md:text-4xl">Explore our products</h2>
        </div>
        <div className="mt-16 m-3 grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product._id} className="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
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
                  <h5 className="text-xl text-gray-800 font-medium transition group-hover:text-slate-600">{product.name}</h5>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <a href="#" className="flex justify-between items-center group-hover:text-slate-600">
                  <span className="text-sm">Read more</span>
                  <span className="-translate-x-4 opacity-0 text-2xl transition duration-300 group-hover:opacity-100 group-hover:translate-x-0"><MdOutlineArrowRightAlt /></span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
