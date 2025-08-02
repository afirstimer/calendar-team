import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { ViewSelector } from "./ViewSelector";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { AddTaskDialog } from "./AddTaskDialog";
import { completeTask, createTask, deleteTask, getTasks } from "../lib/taskService";

export type CalendarView = "month" | "week" | "day" | "list" | "resources" | "timeline";

export interface Person {
    id: string;
    name: string;
    avatar?: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    date: string;
    color: "blue" | "red" | "purple" | "green" | "yellow";
    allDay?: boolean;
    description?: string;
    assignees?: string[];
    priority?: "low" | "medium" | "high";
    repeat?: "none" | "daily" | "weekly" | "monthly";
    completed?: boolean;
}

const samplePeople: Person[] = [
    { id: "HC", name: "Huy Chau" },
    { id: "TT", name: "Thanh Tran" },
    { id: "DEV", name: "Dev1" },
];

export const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>("month");
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                const formatted = data.map((task) => ({
                    id: task.id,
                    title: task.title,
                    startTime: task.startTime,
                    endTime: task.endTime,
                    date: task.date,
                    color: task.color,
                    allDay: task.allDay ?? false,
                    description: task.description ?? "",
                    assignees: task.assignees ?? [],
                    priority: task.priority ?? "low",
                    repeat: task.repeat ?? "none",
                    completed: task.completed ?? false
                }));
                console.log("Formatted tasks:", formatted);
                setEvents(formatted);
            } catch (err) {
                console.error("Error loading tasks from Firebase:", err);
            }
        };

        fetchTasks();
    }, []);

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

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    const handleAddTask = async (task: Omit<CalendarEvent, "id">) => {
        console.log(task);
        await createTask({
            ...task,
            description: task.description ?? "",
            assignees: (task.assignees ?? []).map((a: any) => typeof a === "string" ? a : a.name),
            allDay: task.allDay ?? false,
            createdAt: Date.now(),
            completed: false,
        });
        setShowAddTask(false);
        // reload page
        // window.location.reload();
    };

    const handleCompleteTask = async (event: CalendarEvent) => {
        await completeTask(event.id);
        // Option 1: Re-fetch tasks (simple & clean)
        window.location.reload();
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

                <div className="flex items-center gap-4">
                    <ViewSelector currentView={view} onViewChange={setView} />
                    <Button onClick={() => setShowAddTask(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Task
                    </Button>
                </div>
            </CalendarHeader>

            <CalendarGrid
                currentDate={currentDate}
                events={events}
                view={view}
                onEventClick={handleEventClick}
            />

            <TaskDetailDialog
                event={selectedEvent}
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onDelete={deleteTask}
                onComplete={handleCompleteTask}
            />

            <AddTaskDialog
                isOpen={showAddTask}
                onClose={() => setShowAddTask(false)}
                onAddTask={handleAddTask}
                people={samplePeople}
            />
        </div>
    );
};