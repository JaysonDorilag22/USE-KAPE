import React, { useState, useEffect, useRef } from "react";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import moment from "moment";
export default function Feed() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const loaderRef = useRef();

  // console.log("username", currentUser.username);

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
  }, []); // Empty dependency array to run the effect only once on mount

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
      const res = await fetch(`/api/post/get?offset=${posts.length}&limit=3`);
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
          avatar: currentUser.avatar,
          content: commentInput,
        }),
      });
      if (res.ok) {
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
        <div key={post._id} className="bg-white p-4 mb-5 shadow-md rounded-md">
          <div className="flex items-center mb-2">
            <img
              src={post.avatar} 
              alt="user-avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="font-semibold ml-2">{post.username}</p>
              <p className="text-xs ml-1">{moment(post.createdAt).fromNow()}</p>
            </div>
          </div>
          <p className="mb-2">{post.description}</p>
          <div className="grid grid-cols-2 gap-2">
            {post.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
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
          <div className="mt-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={comment.avatar} 
                      alt="user-avatar"
                    />
                  </div>
                </div>
                <div className="chat-bubble">
                  <div className="font-semibold">{comment.username}</div>
                  <div className="text-xs">
                    {moment(comment.createdAt).fromNow()}
                  </div>
                  <p>{comment.content}</p>
                </div>
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
