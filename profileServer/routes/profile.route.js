import express from "express"

const profileRoutes = express.Router();
import {createProfile,getProfile} from "../controllers/profile.controller.js"

profileRoutes.post("/createprofile",createProfile);
profileRoutes.get("/getprofile/:userid",getProfile);

export default profileRoutes;
