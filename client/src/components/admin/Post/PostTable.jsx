import React, { useEffect, useState } from "react";
import Sidebar from '../../Sidebar';
import { BsPencil, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "../../pagination";

export default function PostTable() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [itemsPerPageOptions, setItemsPerPageOptions] = useState([5, 10, 15]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  //get all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post/get");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  //delete posts
  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected posts?")
    ) {
      try {
        await Promise.all(
          selectedPosts.map(async (postId) => {
            await axios.delete(`/api/post/delete/${postId}`);
          })
        );

        setPosts((prevPosts) =>
          prevPosts.filter(
            (post) => !selectedPosts.includes(post._id)
          )
        );

        setSelectedPosts([]);
      } catch (error) {
        console.error("Error deleting posts:", error);
      }
    }
  };

  const handleCheckboxChange = (postId) => {
    const isSelected = selectedPosts.includes(postId);
    if (isSelected) {
      setSelectedPosts((prevSelected) =>
        prevSelected.filter((id) => id !== postId)
      );
    } else {
      setSelectedPosts((prevSelected) => [...prevSelected, postId]);
    }
  };

  const onPageChange = (newPage) => {
    const totalPages = Math.ceil(posts.length / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  if (searchQuery) {
    currentItems = currentItems.filter(
      (post) =>
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="overflow-x-auto" style={{ flex: 1 }}>
        {/* <CreatePost /> */}

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
              disabled={selectedPosts.length === 0}
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
                    setSelectedPosts(
                      selectedPosts.length === currentItems.length
                        ? []
                        : currentItems.map((post) => post._id)
                    )
                  }
                  checked={
                    selectedPosts.length === currentItems.length &&
                    currentItems.length > 0
                  }
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((post, index) => (
              <tr key={post._id}>
                <td>{post.username}</td>
                <td>{post.description}</td>
                <td>
                  <div className="flex">
                    {post.imageUrls.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt={`post-${post._id}`}
                        className="h-20 w-20 object-cover m-1"
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <Link to={`/edit-post/${post._id}`}>
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      <BsPencil />
                    </button>
                  </Link>
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(post._id)}
                    checked={selectedPosts.includes(post._id)}
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