import { CalendarEvent, CalendarView } from "./Calendar";
import { TimeSlots } from "./TimeSlots";
import { EventBlock } from "./EventBlock";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { ListView } from "./ListView";
import { ResourcesView } from "./ResourcesView";
import { TimelineView } from "./TimelineView";

interface CalendarGridProps {
    currentDate: Date;
    events: CalendarEvent[];
    view: CalendarView;
    onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarGrid = ({ currentDate, events, view, onEventClick }: CalendarGridProps) => {
    // Route to different view components
    switch (view) {
        case "month":
            return <MonthView currentDate={currentDate} events={events} onEventClick={onEventClick} />;
        case "week":
            return <WeekView currentDate={currentDate} events={events} onEventClick={onEventClick} />;
        case "day":
            return <DayView currentDate={currentDate} events={events} onEventClick={onEventClick} />;
        case "list":
            return <ListView currentDate={currentDate} events={events} onEventClick={onEventClick} />;
        case "resources":
            return <ResourcesView currentDate={currentDate} events={events} onEventClick={onEventClick} />;
        case "timeline":
            return <TimelineView currentDate={currentDate} events={events} onEventClick={onEventClick} />;
        default:
            return (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    {view} view not implemented
                </div>
            );
    }

};