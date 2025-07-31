import { CalendarEvent } from "./Calendar";

interface EventBlockProps {
    event: CalendarEvent;
}

export const EventBlock = ({ event }: EventBlockProps) => {
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
        >
            <div className="font-medium text-xs leading-tight">
                {event.startTime} – {event.endTime}
            </div>
            {event.title && (
                <div className="text-xs mt-1 leading-tight opacity-90">
                    {event.title}
                </div>
            )}
        </div>
    );
};