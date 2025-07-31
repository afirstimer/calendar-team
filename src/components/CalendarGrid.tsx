import { CalendarEvent, CalendarView } from "./Calendar";
import { TimeSlots } from "./TimeSlots";
import { EventBlock } from "./EventBlock";
import { MonthView } from "./MonthView";
import { DayView } from "./DayView";
import { ListView } from "./ListView";
import { ResourcesView } from "./ResourcesView";
import { TimelineView } from "./TimelineView";

interface CalendarGridProps {
    currentDate: Date;
    events: CalendarEvent[];
    view: CalendarView;
}

export const CalendarGrid = ({ currentDate, events, view }: CalendarGridProps) => {
    // Route to different view components
    switch (view) {
        case "month":
            return <MonthView currentDate={currentDate} events={events} />;
        case "day":
            return <DayView currentDate={currentDate} events={events} />;
        case "list":
            return <ListView currentDate={currentDate} events={events} />;
        case "resources":
            return <ResourcesView currentDate={currentDate} events={events} />;
        case "timeline":
            return <TimelineView currentDate={currentDate} events={events} />;
        case "week":
            // Fall through to week view implementation below
            break;
        default:
            return (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    {view} view not implemented
                </div>
            );
    }

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

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    const getAllDayEvents = () => {
        return events.filter(event => event.allDay);
    };

    const allDayEvents = getAllDayEvents();

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header with days */}
            <div className="flex border-b border-calendar-grid bg-muted/30">
                <div className="w-20 flex-shrink-0 border-r border-calendar-grid">
                    {allDayEvents.length > 0 && (
                        <div className="h-12 flex items-center justify-center text-xs font-medium text-calendar-time">
                            all-day
                        </div>
                    )}
                </div>
                {weekDays.map((day, index) => {
                    const isToday = day.getTime() === today.getTime();
                    const dayEvents = allDayEvents.filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate.getTime() === day.getTime();
                    });

                    return (
                        <div key={index} className="flex-1 border-r border-calendar-grid last:border-r-0">
                            <div className="h-12 flex flex-col items-center justify-center relative">
                                <div className="text-xs font-medium text-muted-foreground">
                                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                                </div>
                                <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                                    {day.getMonth() + 1}/{day.getDate()}
                                </div>

                                {/* All-day events */}
                                {dayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="absolute bottom-1 left-1 right-1 h-4 rounded text-xs px-1 text-white flex items-center"
                                        style={{
                                            backgroundColor: `hsl(var(--event-${event.color}))`,
                                            fontSize: '10px'
                                        }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
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

                    {/* Day columns */}
                    <div className="absolute inset-0 flex">
                        {weekDays.map((day, dayIndex) => {
                            const isToday = day.getTime() === today.getTime();
                            const dayEvents = getEventsForDate(day).filter(event => !event.allDay);

                            return (
                                <div
                                    key={dayIndex}
                                    className={`flex-1 border-r border-calendar-grid last:border-r-0 relative ${isToday ? 'bg-calendar-today' : ''
                                        }`}
                                >
                                    {/* Events for this day */}
                                    {dayEvents.map((event) => (
                                        <EventBlock key={event.id} event={event} />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};