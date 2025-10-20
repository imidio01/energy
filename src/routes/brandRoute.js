import express from "express";
import { createBrand, deleteBrand, getBrand, updateBrand } from "../controllers/brandController.js";

const router = express.Router();

router.post("/", createBrand);

router.get("/", getBrand);

router.delete("/:id", deleteBrand);

router.put("/:id", updateBrand);


export default router