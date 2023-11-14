import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateCategory() {
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    images: [],
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
      images: [...categoryData.images, ...files],
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
  
    for (const file of categoryData.images) {
      formData.append("images", file);
    }
  
    try {
      const response = await fetch("/api/category/create", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
  
        // Clear the input values after successful creation
        setCategoryData({
          name: "",
          description: "",
          images: [],
        });
  
        // Close the modal
        closeModal();
  
        // Navigate to the category table
        window.location.reload();
      } else {
        console.error("Error creating category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  

  const openModal = () => {
    document.getElementById("my_modal_3").showModal();
  };

  const closeModal = () => {
    document.getElementById("my_modal_3").close();
  };

  return (
    <div style={{ display: "flex" }}>
      {/* <Sidebar /> */}
      <div className="overflow-x-auto" style={{ flex: 1 }}>
        <div className="container mx-auto p-8 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">
            Create a Category for Coffee
          </h2>
          <button className="btn" onClick={openModal}>
            Add new Category
          </button>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form onSubmit={handleSubmit} method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={closeModal}
                >
                  ✕
                </button>
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
                    multiple
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
          </dialog>
        </div>
      </div>
    </div>
  );
}
