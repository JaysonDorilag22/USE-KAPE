import React, { useState } from 'react';

export default function CreateCategory() {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
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
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);

    // Append all selected images to the formData
    for (const file of categoryData.images) {
      formData.append('images', file);
    }

    try {
      // Send the form data to the server using fetch or Axios
      const response = await fetch('/api/category/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Successful creation, handle response data
        const data = await response.json();
        console.log(data);
        // Redirect to a success page or display a success message
      } else {
        // Handle errors here
        console.error('Error creating category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className="m-4 p-4">
      <h2 className="text-2xl font-semibold">Create a Category for coffee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
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

        <div className="mt-4">
          <label htmlFor="description" className="text-sm font-semibold">
            Description:
          </label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
            required
            className="input input-primary"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="images" className="text-sm font-semibold">
            Images (optional):
          </label>
          <input
            type="file"
            accept="image/*"
            name="images"
            onChange={handleImageUpload}
            multiple // Allow multiple file selection
            className="file-input w-full max-w-xs" // Use the custom file input template
          />
        </div>

        <div className="mt-4">
          <h3>Uploaded Images:</h3>
          {categoryData.images.map((image, index) => (
            <div key={index}>
              <img src={URL.createObjectURL(image)} alt={`Uploaded Image ${index}`} />
              <button onClick={() => handleImageRemove(index)}>Remove</button>
            </div>
          ))}
        </div>

        <button type="submit" className="mt-4 btn btn-primary">
          Create Category
        </button>
      </form>
    </div>
  );
}
