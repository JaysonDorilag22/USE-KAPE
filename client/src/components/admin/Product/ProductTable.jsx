import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsPencil, BsTrash } from 'react-icons/bs'; // Import your icon components
import CreateProduct from './CreateProduct';
export default function ProductTable() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set the number of items per page

  useEffect(() => {
    // Fetch products or use your API call to get the products data
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/product/products'); // Update the API endpoint
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleEdit = (productId) => {
    // Implement your edit functionality
    console.log(`Edit product with ID: ${productId}`);
  };

  const handleDelete = (productId) => {
    // Implement your delete functionality
    console.log(`Delete product with ID: ${productId}`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="overflow-x-auto" style={{ flex: 1 }}>
        {/* ... Your existing code ... */}
      <CreateProduct/>
        {/* Product Table */}
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={product._id}>
                <th>{index + 1}</th>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>
                  {product.images.map((image, imageIndex) => (
                    <img
                      key={imageIndex}
                      src={image.url}
                      alt={`Image ${imageIndex + 1}`}
                      style={{
                        width: '50px',
                        height: '50px',
                        marginRight: '5px',
                        display: 'flex - 1',
                      }}
                    />
                  ))}
                </td>
                <td>
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleEdit(product._id)}
                  >
                    <BsPencil />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(product._id)}
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ... Your existing pagination code ... */}
        <ol className="flex justify-center gap-1 text-xs font-medium">
          <li>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
            >
              <span className="sr-only">Prev Page</span>
              {/* ... */}
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                onClick={() => setCurrentPage(index + 1)}
                className={`block h-8 w-8 rounded border ${
                  currentPage === index + 1
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-100 bg-white text-center leading-8 text-gray-900"
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
            >
              <span className="sr-only">Next Page</span>
              {/* ... */}
            </button>
          </li>
        </ol>
      </div>
    </div>
  );
}
