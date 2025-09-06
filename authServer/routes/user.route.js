import express from "express"

const userRoutes = express.Router();
import { registerUser,loginUser } from "../controllers/user.controller.js";

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

export default userRoutes;