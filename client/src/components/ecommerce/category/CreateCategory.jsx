import React, { useState } from 'react';

export default function CreateCategory() {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    image: null, // For file input
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setCategoryData({
      ...categoryData,
      image: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the form data to the server
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    formData.append('image', categoryData.image);

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
          <label htmlFor="image" className="text-sm font-semibold">
            Image (optional):
          </label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageUpload}
            className="input input-primary"
          />
        </div>

        <button type="submit" className="mt-4 btn btn-primary">
          Create Category
        </button>
      </form>
    </div>
  );
}
