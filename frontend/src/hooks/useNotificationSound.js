import { useEffect } from "react";
import { createNotificationSound } from "../utils/notificationSound";

const useNotificationSound = (currentCount, previousCount) => {
    useEffect(() => {
        if (currentCount > previousCount) {
            createNotificationSound();
        }
    }, [currentCount, previousCount]);
};

export default useNotificationSound; 