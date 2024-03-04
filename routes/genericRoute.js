//genericRoute.js
import express from "express";
import multer from "multer";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import blogPostModel from "../models/blogPostModel.js";
import courseModel from "../models/courseModel.js";
import {
  createPostOrCourse,
  deleteItem,
  editPostOrCourse,
  getAll,
  getById,
  likeOrUnlike,
} from "../controllers/genericController.js";

const upload = multer();
const genericRouter = express.Router();

// Determine model and folder based on route
genericRouter.post(
  "/:type",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "contentBlocksImages", maxCount: 10 },
  ]),
    [protect, adminOnly],
  async (req, res) => {
    const type = req.params.type;
    let model, folder;

    switch (type) {
      case "blogPost":
        model = blogPostModel;
        folder = "blog";
        break;
      case "course":
        model = courseModel;
        folder = "course";
        break;
      default:
        return res.status(400).json({ success: false, error: "Invalid type" });
    }

    await createPostOrCourse(model, folder, req, res);
  }
);

// Get all posts/courses
genericRouter.get("/:type", async (req, res) => {
  const { model } = getModelAndFolder(req.params.type);
  if (!model) {
    return res.status(400).json({ success: false, error: "Invalid type" });
  }
  await getAll(model, req, res);
});

// Get a post/course by ID
genericRouter.get("/:type/:id", async (req, res) => {
  const { model } = getModelAndFolder(req.params.type);
  if (!model) {
    return res.status(400).json({ success: false, error: "Invalid type" });
  }
  await getById(model, req, res);
});

// Delete a post/course
genericRouter.delete("/:type/:id", [protect, adminOnly], async (req, res) => {
  const { model } = getModelAndFolder(req.params.type);
  if (!model) {
    return res.status(400).json({ success: false, error: "Invalid type" });
  }
  await deleteItem(model, req, res);
});

//Edit a post/course
genericRouter.put("/:type/:id", upload.fields([
  { name: "headerImage", maxCount: 10 },
  { name: "contentBlocksImages", maxCount: 10 },
]), [protect, adminOnly], async (req, res) => {
  const { model, folder } = getModelAndFolder(req.params.type);
  if (!model) {
    return res.status(400).json({ success: false, error: "Invalid type" });
  }
  await editPostOrCourse(model, folder, req, res);
});


// Like or unlike a post/course
genericRouter.put("/:type/:id/like", protect, async (req, res) => {
  const { model } = getModelAndFolder(req.params.type);
  if (!model) {
    return res.status(400).json({ success: false, error: "Invalid type" });
  }
  await likeOrUnlike(req, res); 
});

// Helper function to get the model and folder
function getModelAndFolder(type) {
  let model, folder;
  switch (type) {
    case "blogPost":
      model = blogPostModel;
      folder = "blog";
      break;
    case "course":
      model = courseModel;
      folder = "course";
      break;
    default:
      model = null;
      folder = null;
  }
  return { model, folder };
}

export default genericRouter;
