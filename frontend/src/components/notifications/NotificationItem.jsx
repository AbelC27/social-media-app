import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotificationItem = ({ notification }) => {
    const queryClient = useQueryClient();

    const { mutate: markAsRead } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/notifications/${notification._id}/read`, {
                    method: "PUT",
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
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutate: deleteNotification } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/notifications/${notification._id}`, {
                    method: "DELETE",
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
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Notification deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const getNotificationMessage = () => {
        switch (notification.type) {
            case "follow":
                return "started following you";
            case "like":
                return "liked your post";
            case "comment":
                return "commented on your post";
            case "reply":
                return "replied to your comment";
            default:
                return "interacted with your content";
        }
    };

    const getNotificationLink = () => {
        switch (notification.type) {
            case "follow":
                return `/profile/${notification.from.username}`;
            case "like":
            case "comment":
            case "reply":
                return `/post/${notification.post._id}`;
            default:
                return "#";
        }
    };

    return (
        <div
            className={`flex items-center gap-4 p-4 rounded-lg ${
                notification.read ? "bg-secondary" : "bg-primary/10"
            }`}
        >
            <Link to={`/profile/${notification.from.username}`}>
                <img
                    src={notification.from.profileImg}
                    alt={notification.from.username}
                    className="w-10 h-10 rounded-full"
                />
            </Link>
            <div className="flex-1">
                <p className="text-sm">
                    <Link
                        to={`/profile/${notification.from.username}`}
                        className="font-semibold hover:underline"
                    >
                        {notification.from.username}
                    </Link>{" "}
                    {getNotificationMessage()}
                    {notification.type !== "follow" && (
                        <Link
                            to={getNotificationLink()}
                            className="text-primary hover:underline ml-1"
                        >
                            View
                        </Link>
                    )}
                </p>
                <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                    })}
                </p>
            </div>
            <div className="flex gap-2">
                {!notification.read && (
                    <button
                        onClick={() => markAsRead()}
                        className="btn btn-primary btn-xs"
                    >
                        Mark as read
                    </button>
                )}
                <button
                    onClick={() => deleteNotification()}
                    className="btn btn-error btn-xs"
                >
                    <FaTrash className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

export default NotificationItem; 