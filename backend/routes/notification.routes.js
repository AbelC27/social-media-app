import express from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteNotifications } from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/:notificationId/read", protectRoute, markAsRead);
router.put("/read-all", protectRoute, markAllAsRead);
router.delete("/:id", protectRoute, deleteNotification);
router.delete("/", protectRoute, deleteNotifications);

export default router; 