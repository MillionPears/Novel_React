import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export const convertTo24Hour = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${date.toLocaleDateString()}, ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const timeAgo = (dateString: string) => {
    const date = new Date(dateString);

    return formatDistanceToNow(date, { addSuffix: true, locale: vi }); // Thêm locale vào hàm
};