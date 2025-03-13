import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import NotificationItem from "../../components/notifications/NotificationItem";
import NotificationSettings from "../../components/notifications/NotificationSettings";
import useNotificationSound from "../../hooks/useNotificationSound";

const NotificationsPage = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [previousCount, setPreviousCount] = useState(0);

    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/notifications");
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    });

    // Use the notification sound hook
    useNotificationSound(notifications?.length || 0, previousCount);
    setPreviousCount(notifications?.length || 0);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <LoadingSpinner size="md" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {showSettings ? "Hide Settings" : "Notification Settings"}
                </button>
            </div>

            {showSettings && (
                <div className="mb-8 bg-gray-800 rounded-lg">
                    <NotificationSettings />
                </div>
            )}

            {notifications?.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications?.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage; 