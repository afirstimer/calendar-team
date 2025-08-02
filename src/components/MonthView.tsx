import { CalendarEvent } from "./Calendar";
import { Avatar } from "./ui/avatar";

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
}

export const MonthView = ({ currentDate, events, onEventClick }: MonthViewProps) => {
    const getMonthDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Days to show (including previous/next month days)
        const days = [];

        // Add days from previous month to fill the first week
        const startDay = firstDay.getDay();
        for (let i = startDay - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({ date, isCurrentMonth: false });
        }

        // Add all days of current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            days.push({ date, isCurrentMonth: true });
        }

        // Add days from next month to fill the last week
        const remainingDays = 42 - days.length; // 6 rows × 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({ date, isCurrentMonth: false });
        }

        return days;
    };

    const monthDays = getMonthDays();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => {
            const eventDateStr = new Date(event.date).toISOString().split('T')[0];
            return eventDateStr === dateStr;
        });
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex-1 flex flex-col p-4">
            {/* Month header */}
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-px mb-px">
                {weekDays.map((day) => (
                    <div key={day} className="bg-muted p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-calendar-grid flex-1">
                {monthDays.map((dayInfo, index) => {
                    const { date, isCurrentMonth } = dayInfo;
                    const isToday = date.getTime() === today.getTime();
                    const dayEvents = getEventsForDate(date);

                    return (
                        <div
                            key={index}
                            className={`bg-background p-2 min-h-[120px] relative ${!isCurrentMonth ? 'text-muted-foreground' : ''
                                } ${isToday ? 'bg-calendar-today' : ''}`}
                        >
                            <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                                {date.getDate()}
                            </div>

                            {/* Events */}
                            <div className="space-y-1">
                                {dayEvents.slice(0, 3).map((event) => (
                                    <div
                                        key={event.id}
                                        className="text-xs p-1 rounded text-white truncate"
                                        style={{ backgroundColor: `hsl(var(--event-${event.color}))` }}
                                        title={event.title}
                                        onClick={() => onEventClick?.(event)}
                                    >
                                        <span className="font-medium">
                                            {event.allDay ? event.title : `${event.startTime} ${event.title}`}
                                        </span>
                                        -
                                        <Avatar className="w-4 h-4 inline-block">
                                            {event.assignees && event.assignees?.length > 0 && (
                                                <span className="text-[10px] text-white/80 truncate avatar-container">
                                                    {event.assignees.map((a) => a).join(", ")}
                                                </span>
                                            )}
                                        </Avatar>
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-xs text-muted-foreground">
                                        +{dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};