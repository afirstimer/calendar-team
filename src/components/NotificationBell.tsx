import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarEvent } from "./Calendar";

interface Notification {
    id: string;
    type: "new_task" | "late_task";
    message: string;
    timestamp: Date;
    taskId?: string;
}

interface NotificationBellProps {
    notifications: Notification[];
    onMarkAsRead: (notificationId: string) => void;
    onClearAll: () => void;
}

export const NotificationBell = ({
    notifications,
    onMarkAsRead,
    onClearAll
}: NotificationBellProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.length;

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8"
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearAll}
                                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                </div>
                <ScrollArea className="max-h-80">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No new notifications
                        </div>
                    ) : (
                        <div className="p-2">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                                    onClick={() => onMarkAsRead(notification.id)}
                                >
                                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground mb-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatTimeAgo(notification.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};