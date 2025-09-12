import { getBlog,postBlog } from "../controllers/blog.controller.js"
import { auth } from "../middleware/auth.js"
import express from "express"

const blogRoutes = express.Router()

blogRoutes.get("/api/blog/:id",getBlog)

blogRoutes.post("/api/bolgs/create",auth,postBlog)

export default blogRoutes