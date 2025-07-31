import { CalendarEvent } from "./Calendar";
import { CalendarIcon, Clock } from "lucide-react";

interface ListViewProps {
    currentDate: Date;
    events: CalendarEvent[];
}

export const ListView = ({ currentDate, events }: ListViewProps) => {
    // Get events for the current week
    const getWeekEvents = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(currentDate.getDate() - day);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const weekEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });

        // Group events by date
        const groupedEvents: { [date: string]: CalendarEvent[] } = {};
        weekEvents.forEach(event => {
            if (!groupedEvents[event.date]) {
                groupedEvents[event.date] = [];
            }
            groupedEvents[event.date].push(event);
        });

        // Sort events within each day
        Object.keys(groupedEvents).forEach(date => {
            groupedEvents[date].sort((a, b) => {
                if (a.allDay && !b.allDay) return -1;
                if (!a.allDay && b.allDay) return 1;
                if (a.allDay && b.allDay) return 0;
                return a.startTime.localeCompare(b.startTime);
            });
        });

        return groupedEvents;
    };

    const weekEvents = getWeekEvents();
    const today = new Date().toISOString().split('T')[0];

    const formatTime = (startTime: string, endTime: string) => {
        if (!startTime || !endTime) return "";

        const formatTimeString = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes);
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        };

        return `${formatTimeString(startTime)} – ${formatTimeString(endTime)}`;
    };

    return (
        <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Week of {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    })}
                </h2>

                {Object.keys(weekEvents).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No events this week</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(weekEvents)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([date, events]) => {
                                const eventDate = new Date(date);
                                const isToday = date === today;

                                return (
                                    <div key={date} className="space-y-4">
                                        <div className={`flex items-center gap-3 pb-2 border-b border-calendar-grid ${isToday ? 'text-primary' : ''
                                            }`}>
                                            <div className="text-lg font-semibold">
                                                {eventDate.toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    month: "long",
                                                    day: "numeric"
                                                })}
                                            </div>
                                            {isToday && (
                                                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                                                    Today
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {events.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                                >
                                                    <div
                                                        className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                                                        style={{ backgroundColor: `hsl(var(--event-${event.color}))` }}
                                                    />

                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-foreground">
                                                            {event.title || "Untitled Event"}
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {event.allDay ? (
                                                                "All day"
                                                            ) : (
                                                                formatTime(event.startTime, event.endTime)
                                                            )}
                                                        </div>

                                                        {event.description && (
                                                            <div className="mt-2 text-sm text-muted-foreground">
                                                                {event.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
};