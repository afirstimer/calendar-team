import { CalendarEvent } from "./Calendar";
import { TimeSlots } from "./TimeSlots";
import { EventBlock } from "./EventBlock";

interface DayViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
}

export const DayView = ({ currentDate, events }: DayViewProps) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = currentDate.getTime() === today.getTime();

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    const dayEvents = getEventsForDate(currentDate);
    const allDayEvents = dayEvents.filter(event => event.allDay);
    const timedEvents = dayEvents.filter(event => !event.allDay);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Day header */}
            <div className="p-4 border-b border-calendar-grid bg-card">
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                        {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
                    </div>
                    <div className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                        {currentDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                        })}
                    </div>
                </div>

                {/* All-day events */}
                {allDayEvents.length > 0 && (
                    <div className="mt-4">
                        <div className="text-xs font-medium text-muted-foreground mb-2">All-day events</div>
                        <div className="space-y-2">
                            {allDayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-2 rounded text-white text-sm"
                                    style={{ backgroundColor: `hsl(var(--event-${event.color}))` }}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Time grid */}
            <div className="flex-1 flex overflow-auto">
                <TimeSlots />
                <div className="flex-1 relative">
                    {/* Grid background */}
                    <div className="absolute inset-0">
                        {Array.from({ length: 48 }, (_, i) => (
                            <div
                                key={i}
                                className="border-b border-calendar-grid"
                                style={{ height: "30px" }}
                            />
                        ))}
                    </div>

                    {/* Day column */}
                    <div className={`absolute inset-0 relative ${isToday ? 'bg-calendar-today' : ''}`}>
                        {/* Events for this day */}
                        {timedEvents.map((event) => (
                            <EventBlock key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};