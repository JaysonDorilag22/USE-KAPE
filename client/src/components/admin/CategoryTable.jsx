import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [isCreateCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // You can adjust the number of items per page

  useEffect(() => {
    fetch("/api/category/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleEdit = (categoryId) => {
    console.log("Edit category with ID:", categoryId);
  };

  const handleDelete = (categoryId) => {
    console.log("Delete category with ID:", categoryId);
  };

  // Calculate total pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Paginate the data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="overflow-x-auto" style={{ flex: 1 }}>
        <button className="inline-block rounded border border-current px-8 py-3 text-sm font-medium text-indigo-600 transition p-10 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-indigo-500">
          <Link to="/create-category">Add Category</Link>
        </button>

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
            {currentItems.map((category, index) => (
              <tr key={category._id}>
                <th>{index + 1}</th>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  {category.images.map((image, imageIndex) => (
                    <img
                      key={imageIndex}
                      src={image.url}
                      alt={`Image ${imageIndex + 1}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "5px",
                        display: "flex - 1"
                      }}
                    />
                  ))}
                </td>
                <td>
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleEdit(category._id)}
                  >
                    <BsPencil />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(category._id)}
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
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
