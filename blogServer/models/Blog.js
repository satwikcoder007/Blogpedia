import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes:{
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export const  Blog = mongoose.model("Blog", BlogSchema,"Blogs");