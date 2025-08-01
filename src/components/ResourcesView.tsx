import { CalendarEvent } from "./Calendar";
import { TimeSlots } from "./TimeSlots";
import { EventBlock } from "./EventBlock";
import { Users } from "lucide-react";

interface ResourcesViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
}

// Sample resources
const resources = [
    { id: "room-a", name: "Conference Room A", color: "blue" },
    { id: "room-b", name: "Conference Room B", color: "green" },
    { id: "john", name: "John Smith", color: "purple" },
    { id: "jane", name: "Jane Doe", color: "red" },
];

export const ResourcesView = ({ currentDate, events }: ResourcesViewProps) => {
    const getWeekDays = (date: Date) => {
        const days = [];
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(date.getDate() - day);

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            days.push(currentDay);
        }
        return days;
    };

    const weekDays = getWeekDays(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Assign events to resources (for demo purposes, we'll distribute them across resources)
    const getEventsForResourceAndDate = (resourceId: string, date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayEvents = events.filter(event => event.date === dateStr && !event.allDay);

        // Simple distribution: assign events based on resource index and event index
        const resourceIndex = resources.findIndex(r => r.id === resourceId);
        return dayEvents.filter((_, eventIndex) => eventIndex % resources.length === resourceIndex);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-calendar-grid bg-card">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Resources View</h2>
                </div>

                {/* Days header */}
                <div className="flex">
                    <div className="w-48 flex-shrink-0"></div>
                    {weekDays.map((day, index) => {
                        const isToday = day.getTime() === today.getTime();
                        return (
                            <div key={index} className="flex-1 text-center border-l border-calendar-grid first:border-l-0">
                                <div className="text-xs font-medium text-muted-foreground">
                                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                                </div>
                                <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                                    {day.getMonth() + 1}/{day.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Resources grid */}
            <div className="flex-1 flex overflow-auto">
                {/* Resource labels */}
                <div className="w-48 flex-shrink-0 border-r border-calendar-grid bg-muted/20">
                    {resources.map((resource) => (
                        <div
                            key={resource.id}
                            className="h-24 flex items-center px-4 border-b border-calendar-grid"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: `hsl(var(--event-${resource.color}))` }}
                                />
                                <span className="font-medium text-sm">{resource.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Time grid for each resource */}
                <div className="flex-1 relative">
                    {/* Grid background */}
                    <div className="absolute inset-0">
                        {resources.map((_, resourceIndex) => (
                            <div key={resourceIndex} className="h-24 border-b border-calendar-grid" />
                        ))}
                    </div>

                    {/* Day columns */}
                    <div className="absolute inset-0 flex">
                        {weekDays.map((day, dayIndex) => {
                            const isToday = day.getTime() === today.getTime();

                            return (
                                <div
                                    key={dayIndex}
                                    className={`flex-1 border-l border-calendar-grid first:border-l-0 ${isToday ? 'bg-calendar-today' : ''
                                        }`}
                                >
                                    {/* Resource rows for this day */}
                                    {resources.map((resource, resourceIndex) => {
                                        const resourceEvents = getEventsForResourceAndDate(resource.id, day);

                                        return (
                                            <div
                                                key={resource.id}
                                                className="h-24 border-b border-calendar-grid relative p-1"
                                            >
                                                {/* Events for this resource and day */}
                                                {resourceEvents.map((event, eventIndex) => (
                                                    <div
                                                        key={event.id}
                                                        className="absolute left-1 right-1 h-5 rounded text-white text-xs px-1 flex items-center truncate"
                                                        style={{
                                                            backgroundColor: `hsl(var(--event-${resource.color}))`,
                                                            top: `${4 + eventIndex * 16}px`,
                                                        }}
                                                        title={`${event.startTime} - ${event.endTime}: ${event.title}`}
                                                    >
                                                        {event.startTime} {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};