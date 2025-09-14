import express from "express"

const profileRoutes = express.Router();
import {createProfile,getProfile, getUserBlogs} from "../controllers/profile.controller.js"

profileRoutes.post("/createprofile",createProfile);
profileRoutes.get("/getprofile/:userid",getProfile);
profileRoutes.get("/getuserblogs/:userid",getUserBlogs);

export default profileRoutes;
