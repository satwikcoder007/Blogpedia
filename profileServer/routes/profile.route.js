import express from "express"

const profileRoutes = express.Router();
import {createProfile} from "../controllers/profile.controller.js"

profileRoutes.post("/createprofile",createProfile);

export default profileRoutes;
