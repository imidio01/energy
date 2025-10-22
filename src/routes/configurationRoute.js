import express from "express";
import { createConfiguration, getConfiguration, updateConfiguration } from "../controllers/configurationsController.js";

const router = express.Router();

router.post("/", createConfiguration);

router.get("/", getConfiguration);

router.put("/", updateConfiguration);

export default router