import { getBlog } from "../controllers/blog.controller.js"
import express from "express"

const blogRoutes = express.Router()

blogRoutes.get("/blog/:id",getBlog)

export default blogRoutes