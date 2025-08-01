import { CalendarEvent } from "./Calendar";
import { Clock, Calendar } from "lucide-react";

interface TimelineViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
}

export const TimelineView = ({ currentDate, events }: TimelineViewProps) => {
    // Get events for the current week and sort them chronologically
    const getTimelineEvents = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(currentDate.getDate() - day);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const weekEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });

        // Sort events chronologically
        return weekEvents.sort((a, b) => {
            const dateComparison = a.date.localeCompare(b.date);
            if (dateComparison !== 0) return dateComparison;

            if (a.allDay && !b.allDay) return -1;
            if (!a.allDay && b.allDay) return 1;
            if (a.allDay && b.allDay) return 0;

            return a.startTime.localeCompare(b.startTime);
        });
    };

    const timelineEvents = getTimelineEvents();
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

    const formatEventDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });
    };

    return (
        <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">Timeline View</h2>
                </div>

                {timelineEvents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No events to display in timeline</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

                        <div className="space-y-6">
                            {timelineEvents.map((event, index) => {
                                const isToday = event.date === today;
                                const isLastEvent = index === timelineEvents.length - 1;

                                return (
                                    <div key={event.id} className="relative flex items-start gap-6">
                                        {/* Timeline dot */}
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className="w-4 h-4 rounded-full border-2 border-background relative z-10"
                                                style={{ backgroundColor: `hsl(var(--event-${event.color}))` }}
                                            />
                                        </div>

                                        {/* Event content */}
                                        <div className="flex-1 min-w-0 pb-6">
                                            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                                                {/* Event header */}
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-foreground leading-tight">
                                                            {event.title || "Untitled Event"}
                                                        </h3>
                                                    </div>
                                                    <div className={`text-sm font-medium px-2 py-1 rounded ${isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {formatEventDate(event.date)}
                                                    </div>
                                                </div>

                                                {/* Event time */}
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                                    <Clock className="h-3 w-3" />
                                                    {event.allDay ? (
                                                        "All day event"
                                                    ) : (
                                                        formatTime(event.startTime, event.endTime)
                                                    )}
                                                </div>

                                                {/* Event description */}
                                                {event.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {event.description}
                                                    </p>
                                                )}

                                                {/* Event category indicator */}
                                                <div className="flex items-center gap-2 mt-3">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: `hsl(var(--event-${event.color}))` }}
                                                    />
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        {event.color} category
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};