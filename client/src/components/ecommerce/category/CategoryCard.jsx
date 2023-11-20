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

  if (loading) {
    // You might want to render a loading spinner or message here
    return <div>Loading...</div>;
  }

  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
        <div>
          <span className="text-gray-600 text-lg font-semibold">Category Features</span>
          <h2 className="mt-4 text-2xl text-gray-900 font-bold md:text-4xl">Explore our categories</h2>
        </div>
        <div className="mt-16 m-3 grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <div key={category._id} className="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
              <div className="relative p-8 space-y-8">
              {category.imageUrls[0] && (
                  <img
                    src={category.imageUrls[0]}
                    className="w-10"
                    width="512"
                    height="512"
                    alt={`category-${category._id}`}
                  />
                )}
                <div className="space-y-2">
                  <h5 className="text-xl text-gray-800 font-medium transition group-hover:text-slate-600">{category.name}</h5>
                  <p className="text-sm text-gray-600">{category.description}</p>
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
  );
}
