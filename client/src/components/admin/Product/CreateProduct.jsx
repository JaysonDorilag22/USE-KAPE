import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateProduct() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    quantity: 0,
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/categories'); // Update the endpoint based on your backend API
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    setProductData({
      ...productData,
      images: [...productData.images, ...files],
    });
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...productData.images];
    updatedImages.splice(index, 1);
    setProductData({
      ...productData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('quantity', productData.quantity);

    for (const file of productData.images) {
      formData.append('images', file);
    }

    try {
      const response = await axios.post('/api/product/create', formData);

      if (response.status === 201) {
        // Successful creation, handle response data
        const data = response.data;
        console.log(data);

        // Clear the form or close the modal after successful creation
        setProductData({
          name: '',
          description: '',
          price: 0,
          category: '',
          quantity: 0,
          images: [],
        });

        // Close the modal
        closeModal();
  
        // Navigate to the category table
        window.location.reload();
      } else {
        // Handle errors here
        console.error('Error creating product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const openModal = () => {
    document.getElementById('create_product_modal').showModal();
  };

  const closeModal = () => {
    document.getElementById('create_product_modal').close();
  };

  return (
    <>
      <button className="btn" onClick={openModal}>
        Open Product Modal
      </button>
      <dialog id="create_product_modal" className="modal">
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
                value={productData.name}
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
                value={productData.description}
                onChange={handleInputChange}
                required
                className="input input-primary h-24"
              />
            </div>

            <div>
              <label htmlFor="price" className="text-sm font-semibold">
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                required
                className="input input-primary"
              />
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-semibold">
                Category:
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                required
                className="input input-primary"
              >
                {loadingCategories ? (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                ) : (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="text-sm font-semibold">
                Quantity:
              </label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                required
                className="input input-primary"
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
                {productData.images.map((image, index) => (
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
              Create Product
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
