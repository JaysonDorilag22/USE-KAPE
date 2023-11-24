import React, { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";

export default function Feed() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  console.log('username',currentUser.username)

  useEffect(() => {
    // Initial load of posts
    loadPosts();

    // Clean-up function
    return () => {
      // Any cleanup logic if needed
    };
  }, []); // Empty dependency array to run the effect only once on mount

  const loadPosts = async () => {
    try {
      // Fetch posts from the API (/api/post/get) using infinite scroll parameters
      const res = await fetch(`/api/post/get?offset=${posts.length}&limit=10`);
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
      {posts.map((post) => (
        <div key={post._id} className="bg-white p-4 mb-4 shadow-md rounded-md">
          <div className="flex items-center mb-2">
            <img
              src={post.avatar} // Use the user's avatar or a default image
              alt="user-avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-semibold">{post.username}</p>
          </div>
          <p className="mb-2">{post.description}</p>
          <div className="mb-2 grid grid-cols-2 gap-2">
            {post.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`post-${index}`}
                className="w-full h-24 object-cover rounded-md"
              />
            ))}
          </div>
          <button
            onClick={() => handleLike(post._id)}
            className="text-blue-500 hover:text-blue-700"
          >
            {post.liked ? "Unlike" : "Like"} ({post.likes} likes)
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
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
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
        <button
          onClick={handleLoadMore}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Load More
        </button>
      )}
    </div>
  );
}
