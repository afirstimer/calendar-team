import { CalendarEvent } from "./Calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EventBlockProps {
    event: CalendarEvent;
    className?: string;
    onClick?: (event: CalendarEvent) => void;
}

export const EventBlock = ({ event, className = "", onClick }: EventBlockProps) => {
    const formatTime = (startTime: string, endTime: string) => {
        if (!startTime || !endTime) return "";

        const formatTime12 = (time: string) => {
            const [hours, minutes] = time.split(":");
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        };

        return `${formatTime12(startTime)} – ${formatTime12(endTime)}`;
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const getTimePosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours * 60 + minutes) / 30; // 30 minutes per slot
    };

    const getEventPosition = () => {
        const startSlot = getTimePosition(event.startTime);
        const endSlot = getTimePosition(event.endTime);
        const height = (endSlot - startSlot) * 30; // 30px per slot
        const top = startSlot * 30;

        return { top, height };
    };

    // For timed events in time grid view
    if (event.startTime && event.endTime && !className) {
        const { top, height } = getEventPosition();

        return (
            <div
                className="absolute left-1 right-1 rounded text-white text-xs p-1 cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: `hsl(var(--event-${event.color}))`,
                    minHeight: '20px',
                    zIndex: 10,
                }}
                onClick={() => onClick?.(event)}
            >
                <div className="font-medium text-xs leading-tight">
                    {event.startTime} – {event.endTime}
                </div>
                {event.title && (
                    <div className="text-xs mt-1 leading-tight opacity-90">
                        {event.title}
                    </div>
                )}
                {event.assignees && event.assignees.length > 0 && (
                    <div className="flex gap-1 mt-1">
                        {event.assignees.slice(0, 2).map((person) => (
                            <div key={person.id} className="relative">
                                <Avatar className="h-4 w-4 border border-white/30">
                                    <AvatarFallback className="text-xs font-medium bg-white/20 text-white">
                                        {getInitials(person.name)}
                                    </AvatarFallback>
                                </Avatar>
                                {person.isOnline && (
                                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-white" />
                                )}
                            </div>
                        ))}
                        {event.assignees.length > 2 && (
                            <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-xs text-white font-medium">
                                +{event.assignees.length - 2}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // For general event blocks (month view, etc.)
    return (
        <div
            className={`
        p-2 rounded text-xs text-white relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity
        ${event.color === "blue" ? "bg-blue-500" : ""}
        ${event.color === "red" ? "bg-red-500" : ""}
        ${event.color === "purple" ? "bg-purple-500" : ""}
        ${event.color === "green" ? "bg-green-500" : ""}
        ${event.color === "orange" ? "bg-orange-500" : ""}
        ${className}
      `}
            onClick={() => onClick?.(event)}
        >
            <div className="font-medium mb-1">{event.title}</div>
            {!event.allDay && (
                <div className="text-white/80 text-xs mb-2">
                    {formatTime(event.startTime, event.endTime)}
                </div>
            )}
            {event.assignees && event.assignees.length > 0 && (
                <div className="flex gap-1 mt-1">
                    {event.assignees.slice(0, 3).map((person) => (
                        <div key={person.id} className="relative">
                            <Avatar className="h-5 w-5 border border-white/30">
                                <AvatarFallback className="text-xs font-medium bg-white/20 text-white">
                                    {getInitials(person.name)}
                                </AvatarFallback>
                            </Avatar>
                            {person.isOnline && (
                                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border border-white" />
                            )}
                        </div>
                    ))}
                    {event.assignees.length > 3 && (
                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs text-white font-medium">
                            +{event.assignees.length - 3}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};