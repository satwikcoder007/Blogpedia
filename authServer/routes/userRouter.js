import express from "express"

const userRoutes = express.Router();
import { registerUser } from "../controllers/userController.js";

userRoutes.post("/register", registerUser);

export default userRoutes;