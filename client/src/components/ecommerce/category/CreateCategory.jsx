import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Sidebar from "../../admin/Sidebar";

export default function CreateCategory() {
  const navigate = useNavigate(); // Initialize useNavigate

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    images: [], // An array to store multiple images
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    setCategoryData({
      ...categoryData,
      images: [...categoryData.images, ...files], // Append selected files to the existing array
    });
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...categoryData.images];
    updatedImages.splice(index, 1);
    setCategoryData({
      ...categoryData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);

    // Append all selected images to the formData
    for (const file of categoryData.images) {
      formData.append("images", file);
    }

    try {
      // Send the form data to the server using fetch or Axios
      const response = await fetch("/api/category/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Successful creation, handle response data
        const data = await response.json();
        console.log(data);
        
        // Use navigate instead of Navigate
        navigate("/category-table");
        // Redirect to a success page or display a success message
      } else {
        // Handle errors here
        console.error("Error creating category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="overflow-x-auto" style={{ flex: 1 }}>
        <div className="container mx-auto p-8 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">
            Create a Category for Coffee
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="text-sm font-semibold">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
                required
                className="input input-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-semibold">
                Description:
              </label>
              <textarea
                name="description"
                value={categoryData.description}
                onChange={handleInputChange}
                required
                className="input input-primary h-24"
              />
            </div>

            <div>
              <label htmlFor="images" className="text-sm font-semibold">
                Images (optional):
              </label>
              <input
                type="file"
                accept="image/*"
                name="images"
                onChange={handleImageUpload}
                multiple // Allow multiple file selection
                className="file-input"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Uploaded Images:</h3>
              <div className="grid grid-cols-2 gap-4">
                {categoryData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded Image ${index}`}
                      className="rounded-md w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="mt-4 btn btn-primary">
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
