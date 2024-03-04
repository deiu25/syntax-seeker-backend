import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import blogPostModel from "../models/blogPostModel.js";

// Add BlogPost
export const createBlogPost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Procesarea imaginilor header
    let imagesLinks = [];
    if (req.files.images) {
      imagesLinks = await uploadImages(req.files.images);
    }

    // Procesarea imaginilor din contentBlocks
    let contentBlocksImagesLinks = [];
    if (req.files.contentBlocksImages) {
      contentBlocksImagesLinks = await uploadImages(req.files.contentBlocksImages);
    }

    req.body.headerImage = imagesLinks;
    req.body.user = user._id;

    // Asociază fiecare imagine din contentBlocks
    let imageIndex = 0;
    req.body.contentBlocks = req.body.contentBlocks.map((block) => {
      if (block.type === "image") {
        block.image = contentBlocksImagesLinks[imageIndex++];
      }
      return block;
    });

    const post = await blogPostModel.create(req.body);
    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

async function uploadImages(files) {
  return Promise.all(
    files.map(async (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "blog" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                public_id: result.public_id,
                url: result.secure_url,
              });
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    })
  );
}

// Get BlogPosts
export const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await blogPostModel.find().populate("user", "name");
    res.status(200).json({ success: true, blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get BlogPost by id
export const getBlogPostById = async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id).populate("user", "name");
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete BlogPost
export const deleteBlogPost = async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    // Delete header images
    if (post.headerImage && post.headerImage.length > 0) {
      const headerImageDeletionPromises = post.headerImage
        .filter(image => image.public_id)
        .map(image => cloudinary.uploader.destroy(image.public_id));

      await Promise.all(headerImageDeletionPromises);
    }

// Delete contentBlocks images
if (post.contentBlocks && post.contentBlocks.length > 0) {
  const contentBlocksImageDeletionPromises  = post.contentBlocks
      .filter(block => block.type === "image" && block.image && block.image.public_id)
      .map(block => cloudinary.uploader.destroy(block.image.public_id));

  await Promise.all(contentBlocksImageDeletionPromises );
}

await blogPostModel.deleteOne({ _id: post._id });
res.status(204).json({ success: true });
}
catch (error) {
console.error(error);
res.status(500).json({ success: false, error: error.message });
}
};
