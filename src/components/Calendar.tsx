import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { ViewSelector } from "./ViewSelector";

export type CalendarView = "month" | "week" | "day" | "list" | "resources" | "timeline";

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    date: string;
    color: "blue" | "red" | "purple" | "green";
    allDay?: boolean;
    description?: string;
}

const sampleEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "All-day events can be displayed at the top",
        startTime: "",
        endTime: "",
        date: "2025-07-28",
        color: "purple",
        allDay: true,
    },
    {
        id: "2",
        title: "The calendar can display background and regular events",
        startTime: "10:00",
        endTime: "14:00",
        date: "2025-07-27",
        color: "red",
    },
    {
        id: "3",
        title: "Events can be assigned to resources and the calendar has the resources view built-in",
        startTime: "09:00",
        endTime: "13:00",
        date: "2025-07-28",
        color: "blue",
    },
    {
        id: "4",
        title: "An event may span to another day",
        startTime: "16:00",
        endTime: "23:59",
        date: "2025-07-28",
        color: "purple",
    },
    {
        id: "5",
        title: "Overlapping events are positioned properly",
        startTime: "15:00",
        endTime: "20:00",
        date: "2025-07-30",
        color: "blue",
    },
    {
        id: "6",
        title: "You have complete control over the display of events...",
        startTime: "10:00",
        endTime: "16:00",
        date: "2025-07-31",
        color: "blue",
    },
    {
        id: "7",
        title: "...and you can drag and drop the events!",
        startTime: "14:00",
        endTime: "19:00",
        date: "2025-08-01",
        color: "red",
    },
    {
        id: "8",
        title: "",
        startTime: "18:00",
        endTime: "21:00",
        date: "2025-08-01",
        color: "purple",
    },
];

export const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>("week");

    const navigateDate = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);

        switch (view) {
            case "month":
                newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
                break;
            case "week":
                newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
                break;
            case "day":
                newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
                break;
            default:
                newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
                break;
        }

        setCurrentDate(newDate);
    };

    const getDateRangeText = () => {
        switch (view) {
            case "month":
                return currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                });
            case "day":
                return currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
            case "week":
            case "list":
            case "resources":
            case "timeline":
                const weekStart = new Date(currentDate);
                const day = weekStart.getDay();
                weekStart.setDate(currentDate.getDate() - day);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                return `${weekStart.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })} – ${weekEnd.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}`;
            default:
                return "";
        }
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            <CalendarHeader>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateDate("prev")}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateDate("next")}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={goToToday}
                            className="h-8 px-3 text-sm"
                        >
                            today
                        </Button>
                    </div>
                    <div className="text-xl font-semibold">
                        {getDateRangeText()}
                    </div>
                </div>

                <ViewSelector currentView={view} onViewChange={setView} />
            </CalendarHeader>

            <CalendarGrid
                currentDate={currentDate}
                events={sampleEvents}
                view={view}
            />
        </div>
    );
};