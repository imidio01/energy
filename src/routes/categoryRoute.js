import express from "express";
import { createCategory, deleteCategory, getCategory, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);

router.get("/", getCategory);

router.delete("/:id", deleteCategory);

router.put("/:id", updateCategory);


export default router