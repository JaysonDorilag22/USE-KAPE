import React, { useState, useEffect, useRef } from "react";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";
import { FaHeart, FaTrash, FaPen } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
export default function Timeline() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const loaderRef = useRef();
  console.log("username", currentUser.username);
  console.log("username", currentUser._id);

  useEffect(() => {
    loadPosts();

    const handleScroll = () => {
      const { current } = loaderRef;
      if (current && isElementInViewport(current)) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const loadPosts = async () => {
    try {
      // Fetch posts from the API (/api/post/get) using infinite scroll parameters
      const res = await fetch(
        `/api/post/get/${currentUser._id}/?offset=${posts.length}&limit=10`
      );
      const data = await res.json();

      // Check if the response has an array of posts
      if (Array.isArray(data) && data.length > 0) {
        // Update state with new posts
        setPosts((prevPosts) => [...prevPosts, ...data]);

        // Update hasMore based on whether there are more posts
        setHasMore(data.length > 0);
      } else {
        console.error("Invalid data format. Expected an array of posts.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading posts:", error);
      setLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      if (!currentUser || !currentUser._id) {
        console.error("User or user ID is undefined.");
        return;
      }

      // Send a request to the API to like/unlike the post
      const res = await fetch(`/api/post/like/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
        }),
      });

      if (res.ok) {
        // If the request is successful, update the post's liked status and likes count in the state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likes: post.liked ? post.likes - 1 : post.likes + 1,
                  likedBy: post.liked
                    ? post.likedBy.filter((id) => id !== currentUser._id)
                    : [...post.likedBy, currentUser._id],
                }
              : post
          )
        );
      } else {
        console.error("Failed to like/unlike the post.");
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const res = await axios.delete(`/api/post/delete/${postId}`);
      if (res.status === 200) {
        // If the request is successful, remove the deleted post from the state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        console.error("Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const addComment = async (postId) => {
    try {
      if (!currentUser || !currentUser._id) {
        console.error("User or user ID is undefined.");
        return;
      }
      // Send a request to the API to add a comment
      const res = await fetch(`/api/post/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          username: currentUser.username,
          content: commentInput,
        }),
      });
      if (res.ok) {
        // If the request is successful, update the post's comments in the state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      _id: Math.random().toString(36).substring(7),
                      user: currentUser._id,
                      username: currentUser.username,
                      content: commentInput,
                    },
                  ],
                }
              : post
          )
        );

        // Clear the comment input
        setCommentInput("");
      } else {
        console.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = (postId) => {
    likePost(postId);
  };

  const handleCommentInput = (e) => {
    setCommentInput(e.target.value);
  };

  const handleCommentSubmit = (postId) => {
    addComment(postId);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      loadPosts();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <CreatePost />
      {posts.map((post, index) => (
        <div
          key={post.id || index}
          className="bg-white p-4 mb-4 shadow-md rounded-md"
        >
          <div className="flex items-center mb-2">
            <img
              src={post.avatar}
              alt="user-avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-semibold">{post.username}</p>
            <button
              onClick={() => handleDelete(post._id)}
              className="ml-2 text-gray-500 hover:text-red-700 cursor-pointer"
            >
              <FaTrash />
            </button>
            <Link to={`/edit-post/${post._id}`}>
              <button className="text-gray-500 hover:text-blue-700 cursor-pointer ml-3">
                <FaPen />
              </button>
            </Link>
          </div>
          <p className="mb-2">{post.description}</p>
          <div className="grid grid-cols-2 gap-2">
            {post.imageUrls.map((imageUrl, index) => (
              <img
                key={imageUrl} // Assuming imageUrl is unique for each post
                src={imageUrl}
                alt={`post-${index}`}
                className="h-auto max-w-full rounded-lg"
              />
            ))}
          </div>
          <button
            onClick={() => handleLike(post._id)}
            className={`flex items-center mt-3 ${
              post.liked ? "text-red-500" : "text-gray-500"
            } hover:text-red-700`}
          >
            <FaHeart
              className={`mr-1 ${
                post.liked ? "fill-current" : "stroke-current"
              }`}
            />
            {post.likes}
          </button>

          {/* Comment Input Form */}
          <div className="mt-4">
            <input
              type="text"
              value={commentInput}
              onChange={handleCommentInput}
              placeholder="Add a comment"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            <button
              onClick={() => handleCommentSubmit(post._id)}
              className="mt-2 w-full rounded border border-slate-600 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500"
            >
              Add Comment
            </button>
          </div>

          {/* Display comments */}
          <div className="mt-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex mb-2">
                <p className="font-semibold mr-2">{comment.username}:</p>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!loading && hasMore && (
        <div className="flex justify-center items-center h-16">
          <span
            ref={loaderRef}
            className="loading loading-spinner loading-lg"
          ></span>
        </div>
      )}
    </div>
  );
}
