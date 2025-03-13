import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../common/LoadingSpinner";

const NotificationSettings = () => {
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery({
        queryKey: ["notificationSettings"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/notification-settings");
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

    const { mutate: updateSettings } = useMutation({
        mutationFn: async (newSettings) => {
            try {
                const res = await fetch("/api/notification-settings", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newSettings),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
            toast.success("Notification settings updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <LoadingSpinner size="md" />
            </div>
        );
    }

    const handleToggle = (field) => {
        updateSettings({
            ...settings,
            [field]: !settings[field],
        });
    };

    const handleNotificationTypeToggle = (type) => {
        updateSettings({
            ...settings,
            notificationTypes: {
                ...settings.notificationTypes,
                [type]: !settings.notificationTypes[type],
            },
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.emailNotifications}
                            onChange={() => handleToggle("emailNotifications")}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.pushNotifications}
                            onChange={() => handleToggle("pushNotifications")}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Notification Sound</h3>
                        <p className="text-sm text-gray-500">Play sound for new notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.soundEnabled}
                            onChange={() => handleToggle("soundEnabled")}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-3">Notification Types</h3>
                    <div className="space-y-3">
                        {Object.entries(settings.notificationTypes).map(([type, enabled]) => (
                            <div key={type} className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium capitalize">{type}</h4>
                                    <p className="text-sm text-gray-500">
                                        Receive notifications for {type} actions
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={enabled}
                                        onChange={() => handleNotificationTypeToggle(type)}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings; 