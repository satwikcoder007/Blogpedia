import express from "express"

const profileRoutes = express.Router();
import {createProfile,getProfile, getUserBlogs} from "../controllers/profile.controller.js"

profileRoutes.post("/profile/createprofile",createProfile);
profileRoutes.get("/profile/getprofile/:userid",getProfile);
profileRoutes.get("/profile/getuserblogs/:userid",getUserBlogs);

export default profileRoutes;
