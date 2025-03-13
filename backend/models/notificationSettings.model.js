import mongoose from "mongoose";

const notificationSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    pushNotifications: {
        type: Boolean,
        default: true
    },
    soundEnabled: {
        type: Boolean,
        default: true
    },
    notificationTypes: {
        follow: {
            type: Boolean,
            default: true
        },
        like: {
            type: Boolean,
            default: true
        },
        comment: {
            type: Boolean,
            default: true
        },
        reply: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

export default NotificationSettings; 