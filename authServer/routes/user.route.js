import express from "express"

const userRoutes = express.Router();
import { registerUser,loginUser } from "../controllers/user.controller.js";

userRoutes.post("/auth/register", registerUser);
userRoutes.post("/auth/login", loginUser);

export default userRoutes;