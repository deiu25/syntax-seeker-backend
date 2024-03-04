import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  htmlCode: {
    type: String,
    required: true,
  },
  cssCode: {
    type: String,
    required: true,
  },
  jsCode: {
    type: String,
  },
  // tags: [
  //   {
  //     type: mongoose.Types.ObjectId,
  //     ref: "Tag",
  //     required: true,
  //   },
  // ],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Like",
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
  },
  views: [
    {
      type: mongoose.Types.ObjectId,
      ref: "View",
    },
  ],
  viewsCount: {
    type: Number,
    default: 0,
  },
  shares: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Share",
    },
  ],
  saves: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Save",
    },
  ],
});

export default mongoose.model("Snippet", snippetSchema);
