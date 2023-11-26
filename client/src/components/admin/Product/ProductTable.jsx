import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import CreateProduct from "./CreateProduct";
import axios from "axios";
import Pagination from "../../pagination";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [itemsPerPageOptions, setItemsPerPageOptions] = useState([5, 10, 15]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product/products");
        const sortedProducts = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [fetchTrigger]);

  const handleCreateProduct = async (newProduct) => {
    try {
      await createProduct(newProduct);
      setFetchTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete the selected products?")) {
      try {
        await Promise.all(
          selectedProducts.map(async (productId) => {
            await axios.delete(`/api/product/delete/${productId}`);
          })
        );

        setProducts((prevProducts) =>
          prevProducts.filter((product) => !selectedProducts.includes(product._id))
        );

        setSelectedProducts([]);
      } catch (error) {
        console.error("Error deleting products:", error);
      }
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  if (searchQuery) {
    currentItems = currentItems.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const onPageChange = (newPage) => {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="overflow-x-auto" style={{ flex: 1 }}>
        <CreateProduct onCreateProduct={handleCreateProduct} />

        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="itemsPerPage" className="ml-5">
              Show:{" "}
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="m-4"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <label htmlFor="searchQuery" className="text-sm font-semibold m-4">
              Search:
            </label>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md max-w-md"
            />
          </div>
          <div className="flex items-center">
            <button
              className="px-4 p-2 bg-red-700 text-white rounded-md m-3"
              onClick={handleDelete}
              disabled={selectedProducts.length === 0}
            >
              <BsTrash />
            </button>
          </div>
        </div>

        <table className="table table-xl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Flavor</th>
              <th>Size</th>
              <th>Images</th>
              <th>Actions</th>
              <th>
                <input
                  type="checkbox"
                  onChange={() =>
                    setSelectedProducts(
                      selectedProducts.length === currentItems.length
                        ? []
                        : currentItems.map((product) => product._id)
                    )
                  }
                  checked={
                    selectedProducts.length === currentItems.length &&
                    currentItems.length > 0
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.type}</td>
                <td>{product.flavor}</td>
                <td>{product.size}</td>
                <td>
                  <div className="flex">
                    {product.imageUrls.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt={`product-${product._id}`}
                        className="h-20 w-20 object-cover m-1"
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <Link to={`/update-product/${product._id}`}>
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      <BsPencil />
                    </button>
                  </Link>
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(product._id)}
                    checked={selectedProducts.includes(product._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
