// CategoryList.jsx
import React, { useEffect, useState } from 'react';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/category/categories') // Adjust the API endpoint to match your server's route
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <div className="flex flex-wrap">
      {categories.map((category, index) => (
        <div key={index} className="w-1/4 p-4">
          <div className="card w-64 bg-white shadow-xl rounded-lg">
            <figure>
            <img
                src={category.image.url} // Use category.image.url as the image URL
                alt={category.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </figure>
            <div className="card-body p-4">
              <h2 className="card-title text-lg font-semibold text-gray-800 mb-2">
                {category.name}
                {category.new && <div className="badge badge-primary ml-2">NEW</div>}
              </h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}