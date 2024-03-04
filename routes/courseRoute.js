import express from "express";
import multer from "multer";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { createCourse, deleteCourse, getCourse, getCourseById } from "../controllers/courseController.js";


const upload = multer();
const courseRouter = express.Router();

// Create a new blog post
courseRouter.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "contentBlocksImages", maxCount: 10 }
  ]),
  protect,
  createCourse
);

// Get all blog posts
courseRouter.get("/", getCourse);

// Get a specific blog post by id
courseRouter.get("/:id", getCourseById);

// Delete a specific blog post by id
courseRouter.delete("/:id", protect, adminOnly, deleteCourse);

export default courseRouter;
