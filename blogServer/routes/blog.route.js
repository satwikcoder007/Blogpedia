import { getBlog,postBlog } from "../controllers/blog.controller.js"
import express from "express"

const blogRoutes = express.Router()

blogRoutes.get("/blog/:id",getBlog)
blogRoutes.post("/postblog",postBlog)


export default blogRoutes