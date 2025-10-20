import express from "express";
import { createModel, deleteModel, getModel, updateModel } from "../controllers/modelController.js";

const router = express.Router();

router.post("/", createModel);

router.get("/", getModel);

router.delete("/:id", deleteModel);

router.put("/:id", updateModel);


export default router