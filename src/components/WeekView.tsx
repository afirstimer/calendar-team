import { CalendarEvent } from "./Calendar";
import { TimeSlots } from "./TimeSlots";
import { EventBlock } from "./EventBlock";

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
}

export const WeekView = ({ currentDate, events, onEventClick }: WeekViewProps) => {
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
        return events.filter(event => {
            const eventDateStr = new Date(event.date).toISOString().split('T')[0];
            return eventDateStr === dateStr;
        });
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Week header */}
            <div className="border-b border-calendar-grid bg-card">
                {/* All-day events row */}
                <div className="flex">
                    <div className="w-20 flex-shrink-0 border-r border-calendar-grid bg-muted/20 text-xs text-center py-2 text-calendar-time">
                        All day
                    </div>
                    {weekDays.map((day, index) => {
                        const isToday = day.getTime() === today.getTime();
                        const allDayEvents = getEventsForDate(day).filter(event => event.allDay);

                        return (
                            <div
                                key={index}
                                className={`flex-1 min-h-[60px] border-l border-calendar-grid first:border-l-0 p-1 ${isToday ? 'bg-calendar-today' : ''
                                    }`}
                            >
                                {allDayEvents.map((event) => (
                                    <EventBlock
                                        key={event.id}
                                        event={event}
                                        className="mb-1"
                                        onClick={onEventClick}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>

                {/* Days header */}
                <div className="flex">
                    <div className="w-20 flex-shrink-0 border-r border-calendar-grid bg-muted/20"></div>
                    {weekDays.map((day, index) => {
                        const isToday = day.getTime() === today.getTime();
                        return (
                            <div key={index} className="flex-1 text-center py-2 border-l border-calendar-grid first:border-l-0">
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

            {/* Time grid */}
            <div className="flex-1 flex overflow-auto">
                <TimeSlots />
                <div className="flex-1 flex">
                    {weekDays.map((day, index) => {
                        const isToday = day.getTime() === today.getTime();
                        const dayEvents = getEventsForDate(day).filter(event => !event.allDay);

                        return (
                            <div
                                key={index}
                                className={`flex-1 relative border-l border-calendar-grid first:border-l-0 ${isToday ? 'bg-calendar-today' : ''
                                    }`}
                            >
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

                                {/* Events for this day */}
                                {dayEvents.map((event) => (
                                    <EventBlock key={event.id} event={event} onClick={onEventClick} />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};