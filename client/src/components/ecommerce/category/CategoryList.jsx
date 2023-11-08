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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <div key={index} className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="relative">
            <div className="aspect-w-3 aspect-h-2">
              {category.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image.url} // Use image.url as the image URL
                  alt={`${category.name} - Image ${imgIndex}`}
                  className="object-cover"
                />
              ))}
            </div>
            {category.new && (
              <div className="badge badge-primary absolute top-4 left-4">NEW</div>
            )}
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
