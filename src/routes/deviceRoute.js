import express from "express";
import { getAllDevices, createDevice, getDeviceByUserId, getDeviceDetailsByDeviceId, deleteDevice, updateDevice } from "../controllers/deviceController.js";

const router = express.Router();

router.post("/", createDevice);

router.get("/", getAllDevices);

router.get("/:userId", getDeviceByUserId);

router.get("/:deviceId/details", getDeviceDetailsByDeviceId);

router.delete("/:id", deleteDevice);

router.put("/:id", updateDevice);


export default router