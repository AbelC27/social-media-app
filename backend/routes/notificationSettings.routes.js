import express from "express";
import { getNotificationSettings, updateNotificationSettings } from "../controllers/notificationSettings.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getNotificationSettings);
router.put("/", protectRoute, updateNotificationSettings);

export default router; 