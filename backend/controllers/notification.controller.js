import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.user._id })
            .populate('from', 'username profileImg')
            .populate('post', 'text')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        if (notification.to.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorized to mark this notification as read" });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.log("Error in markAsRead:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { to: req.user._id, read: false },
            { read: true }
        );

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.log("Error in markAllAsRead:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOne({ _id: id, to: userId });
        
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        await Notification.findByIdAndDelete(id);
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotification", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteNotifications=async(req,res)=>{
    try {
        const userId=req.user._id;
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:"Notifications deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNotifications:",error.message);
        res.status(500).json({error:error.message});
    }
};