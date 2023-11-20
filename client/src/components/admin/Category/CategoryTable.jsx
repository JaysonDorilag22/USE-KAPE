import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import CreateCategory from "./CreateCategory";
import axios from "axios";
import Pagination from "../../pagination";

export default function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [itemsPerPageOptions, setItemsPerPageOptions] = useState([5, 10, 15]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected categories?")
    ) {
      try {
        await Promise.all(
          selectedCategories.map(async (categoryId) => {
            await axios.delete(`/api/category/delete/${categoryId}`);
          })
        );

        setCategories((prevCategories) =>
          prevCategories.filter(
            (category) => !selectedCategories.includes(category._id)
          )
        );

        setSelectedCategories([]);
      } catch (error) {
        console.error("Error deleting categories:", error);
      }
    }
  };

  const handleCheckboxChange = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
    }
  };

  const onPageChange = (newPage) => {
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  if (searchQuery) {
    currentItems = currentItems.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="overflow-x-auto" style={{ flex: 1 }}>
        <CreateCategory />

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
              disabled={selectedCategories.length === 0}
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
              <th>Images</th>
              <th>Actions</th>
              <th>
                <input
                  type="checkbox"
                  onChange={() =>
                    setSelectedCategories(
                      selectedCategories.length === currentItems.length
                        ? []
                        : currentItems.map((category) => category._id)
                    )
                  }
                  checked={
                    selectedCategories.length === currentItems.length &&
                    currentItems.length > 0
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category, index) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <div className="flex">
                    {category.imageUrls.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt={`category-${category._id}`}
                        className="h-20 w-20 object-cover m-1"
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <Link to={`/update-category/${category._id}`}>
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      <BsPencil />
                    </button>
                  </Link>
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(category._id)}
                    checked={selectedCategories.includes(category._id)}
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
