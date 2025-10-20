import express from "express";
import { getUserProfile, createUserProfile, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUserProfile);

router.get("/:userId", getUserProfile);

router.put("/:id", updateUserProfile);

export default router