import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  headerImage: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  subtitle: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  contentBlocks: [
    {
      type: {
        type: String,
        enum: ["image", "text", "code"],
        required: true,
      },
      text: String,
      image: {
        public_id: String,
        url: String,
      },
      code: String, 
      language: String, 
      subtitle: String,
      preDescription: {
        type: String,
        default: '', 
      },
      postDescription: {
        type: String,
        default: '', 
      },
      preSubtitle: {
        type: String,
        default: '', 
      },
      postSubtitle: {
        type: String,
        default: '', 
      },
    },
  ],  
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: String,
    required: true,
    enum: ['javascript', 'css', 'html', 'react', 'redux', 'vue', 'node', 'mongodb', 'express', 'api', 'git', 'career', 'other'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Course", postSchema);
