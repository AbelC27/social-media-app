import NotificationSettings from "../models/notificationSettings.model.js";

export const getNotificationSettings = async (req, res) => {
    try {
        let settings = await NotificationSettings.findOne({ user: req.user._id });
        
        if (!settings) {
            // Create default settings if none exist
            settings = await NotificationSettings.create({
                user: req.user._id
            });
        }

        res.status(200).json(settings);
    } catch (error) {
        console.log("Error in getNotificationSettings:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const updateNotificationSettings = async (req, res) => {
    try {
        const { emailNotifications, pushNotifications, soundEnabled, notificationTypes } = req.body;

        const settings = await NotificationSettings.findOneAndUpdate(
            { user: req.user._id },
            {
                emailNotifications,
                pushNotifications,
                soundEnabled,
                notificationTypes
            },
            { new: true, upsert: true }
        );

        res.status(200).json(settings);
    } catch (error) {
        console.log("Error in updateNotificationSettings:", error.message);
        res.status(500).json({ error: error.message });
    }
}; 