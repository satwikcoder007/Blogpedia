import { getBlog,postBlog } from "../controllers/blog.controller.js"
//import { auth } from "../middleware/auth.js"
import express from "express"
import upload from "../middleware/multer.js"

const blogRoutes = express.Router()

blogRoutes.get("/api/blog/:id",getBlog)

blogRoutes.post("/blogs/create/:id", upload.single("image"),postBlog)

export default blogRoutes