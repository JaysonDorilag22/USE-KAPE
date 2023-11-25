import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { isAuthorized } from "../middleware/authorizationMiddleware.js";
// Create a new post
export const createPost = async (req, res) => {
  try {
    const { user, description, imageUrls } = req.body;
    const userObject = await User.findById(user);

    if (!userObject) {
      return res.status(404).json({ error: "User not found" });
    }

    const newPost = new Post({
      user: userObject._id,
      username: userObject.username,
      avatar: userObject.avatar,
      description,
      imageUrls,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get posts for the feed
export const getFeedPosts = async (req, res) => {
  try {
    // You may need to customize this query based on your specific requirements
    const feedPosts = await Post.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Error getting feed posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get posts for a specific user
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPosts = await Post.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id; // Assuming you have user information in req.user

    // Check if the user has already liked the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userHasLiked = post.likedBy.includes(userId);

    if (userHasLiked) {
      // User has already liked the post, so clicking again should unlike
      await Post.updateOne(
        { _id: postId },
        {
          $inc: { likes: -1 },
          $pull: { likedBy: userId },
        }
      );
    } else {
      // User has not liked the post, so clicking should like
      await Post.updateOne(
        { _id: postId },
        {
          $inc: { likes: 1 },
          $push: { likedBy: userId },
        }
      );
    }

    res.status(200).json({ message: 'Like action completed' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id; // Assuming you have user information in req.user
    const { content } = req.body;

    // Check if the post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Assuming you have user information in req.user
    const userObject = await User.findById(userId);

    if (!userObject) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new comment
    const newComment = {
      user: userObject._id,
      username: userObject.username,
      avatar: userObject.avatar,
      content,
    };

    // Add the new comment to the post
    post.comments.push(newComment);

    // Save the updated post
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID in the database
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error getting post by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Edit a post
export const editPost = async (req, res) => {
  try {
    // Check if the user is authorized
    isAuthorized(req, res, async () => {
      const postId = req.params.postId;
      const { description, imageUrls } = req.body;

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $set: {
            description,
            imageUrls,
          },
        },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(updatedPost);
    });
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    // Check if the user is authorized
    isAuthorized(req, res, async () => {
      const postId = req.params.postId;

      const deletedPost = await Post.findByIdAndRemove(postId);

      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// export const editPost = async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const { description, imageUrls } = req.body;

//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       {
//         $set: {
//           description,
//           imageUrls,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedPost) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     res.status(200).json(updatedPost);
//   } catch (error) {
//     console.error("Error editing post:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Delete a post
// export const deletePost = async (req, res) => {
//   try {
//     const postId = req.params.postId;

//     const deletedPost = await Post.findByIdAndRemove(postId);

//     if (!deletedPost) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
