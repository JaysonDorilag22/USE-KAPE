import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineArrowRightAlt } from "react-icons/md";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // if (loading) {
  //   // You might want to render a loading spinner or message here
  //   return <div className="flex justify-center items-center h-16">
  //   <span  className="loading loading-spinner loading-lg"></span>
  // </div>;
  // }

  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
    <div className="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
      <div>
        <span className="text-gray-600 text-lg font-semibold">Category Features</span>
        <h2 className="mt-4 text-2xl text-gray-900 font-bold md:text-4xl">Explore our categories</h2>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <a href="#" key={category._id} className="group relative block">
            <div className="relative h-[350px] sm:h-[450px]">
              {category.imageUrls.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  loading="lazy"
                  alt={`category-${category._id}-${index}`}
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"

                />
              ))}
            </div>
  
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
              <h3 className="text-xl font-medium text-white">{category.name}</h3>
              {/* <span
                className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
              >
                Shop Now
              </span> */}
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
  
  );
}
