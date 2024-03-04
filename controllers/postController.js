import User from "../models/userModel.js";
import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";
import mongoose from "mongoose";

// Add Post
export const addPost = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    // Crearea unui nou obiect Post cu title și content
    const post = new Post({
      title,
      htmlCode: content.htmlCode,
      cssCode: content.cssCode,
      jsCode: content.jsCode,
      user: req.user._id,
    });

    // Salvarea postului în baza de date
    await post.save();

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the post.",
      error: error.message,
    });
  }
};

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user", "lastname");
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while getting all posts.",
      error: error.message,
    });
  }
};

// Get post by id
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "lastname"
    );
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while getting the post.",
      error: error.message,
    });
  }
};

// Update post
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post.",
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    post.title = title;
    post.htmlCode = content.htmlCode;
    post.cssCode = content.cssCode;
    post.jsCode = content.jsCode;

    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the post.",
      error: error.message,
    });
  }
};

// Like or unlike a post
export const likeOrUnlikePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { _id: userId } = req.user;

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const like = await Like.findOneAndDelete({ user: userId, post: postId });
    let operationType = 'unknown';

    if (like) {
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      operationType = 'unlike';
    } else {
      await new Like({ user: userId, post: postId }).save();
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      operationType = 'like';
    }

    const updatedPost = await Post.findById(postId, 'likesCount');

    res.status(200).json({
      success: true,
      operationType,
      likesCount: updatedPost.likesCount,
    });
  } catch (error) {
    console.error("Eroare la procesarea like/unlike", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send(`No post with id: ${req.params.id}`);
    }
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }

    await Like.deleteMany({ post: req.params.id });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: "Post and associated likes successfully deleted.",
    });
  } catch (error) {
    console.error("An error occurred while deleting the post and its likes.", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the post and its likes.",
      error: error.message,
    });
  }
};
