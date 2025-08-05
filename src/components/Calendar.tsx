import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { ViewSelector } from "./ViewSelector";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { AddTaskDialog } from "./AddTaskDialog";
import { UserList } from "./UserList";
import { DateTasksDialog } from "./DateTasksDialog";
import { NotificationBell } from "./NotificationBell";
import { useToast } from "@/hooks/use-toast";
import { completeTask, createTask, deleteTask, getTasks, updateTask } from "../lib/taskService";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, LogOut } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { TaskInput } from "../lib/types";

export type CalendarView = "month" | "week" | "day" | "list" | "resources" | "timeline";

export interface Notification {
    id: string;
    type: "new_task" | "late_task";
    message: string;
    timestamp: Date;
    taskId?: string;
}

export interface Person {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
    isAdmin?: boolean;
}

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    date: string;
    color: "blue" | "red" | "purple" | "green" | "orange";
    allDay?: boolean;
    description?: string;
    assignees?: Person[];
    assigneeIds?: string[];
    priority?: "low" | "medium" | "high";
    repeat?: "none" | "daily" | "weekly" | "monthly";
    completed?: boolean;
}

export const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>("month");
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [people, setPeople] = useState<Person[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { toast } = useToast();

    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snapshot = await getDocs(collection(db, "users"));
                const users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: data.uid,
                        name: data.name || data.email,
                        avatar: "" // if you later support avatars
                    };
                });
                setPeople(users);
            } catch (err) {
                console.error("Error loading users:", err);
            }
        };

        fetchUsers();
    }, []);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                const currentUserId = user?.uid;
                const allFormatted = data.map((task) => ({
                    id: task.id,
                    title: task.title,
                    startTime: task.startTime,
                    endTime: task.endTime,
                    date: task.date,
                    color: task.color,
                    allDay: task.allDay ?? false,
                    description: task.description ?? "",
                    assignees: task.assignees ?? [],
                    assigneeIds: task.assigneeIds ?? [],
                    priority: task.priority ?? "low",
                    repeat: task.repeat ?? "none",
                    completed: task.completed ?? false
                }));

                const visibleTasks = selectedUserId
                    ? allFormatted.filter(task => task.assigneeIds.includes(selectedUserId))
                    : allFormatted.filter(task => task.assigneeIds.includes(user?.uid));

                setEvents(visibleTasks);
            } catch (err) {
                console.error("Error loading tasks from Firebase:", err);
            }
        };

        fetchTasks();
    }, [user, selectedUserId]);


    // Check for late tasks on component mount and when events change
    useEffect(() => {

        const checkLateTasks = () => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const lateTasksFromYesterday = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate < today && eventDate.toDateString() === yesterday.toDateString();
            });

            const lateNotifications: Notification[] = lateTasksFromYesterday.map(task => ({
                id: `late-${task.id}`,
                type: "late_task" as const,
                message: `Task "${task.title}" from yesterday is overdue`,
                timestamp: new Date(),
                taskId: task.id,
            }));

            // Only add notifications for tasks we haven't already notified about
            const existingLateTaskIds = notifications
                .filter(n => n.type === "late_task")
                .map(n => n.taskId);

            const newLateNotifications = lateNotifications.filter(
                notification => !existingLateTaskIds.includes(notification.taskId)
            );

            if (newLateNotifications.length > 0) {
                setNotifications(prev => [...prev, ...newLateNotifications]);
            }
        };

        checkLateTasks();
    }, [events, notifications]);

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

    const handleDateClick = (date: Date, dateEvents: CalendarEvent[]) => {
        setSelectedDate(date);
        setSelectedDateEvents(dateEvents);
    };

    const handleAddTask = (newTask: Omit<CalendarEvent, "id">) => {
        const task: CalendarEvent = {
            ...newTask,
            id: Math.random().toString(36).substr(2, 9),
        };
        setEvents([...events, task]);
        setShowAddTask(false);

        // Add notification for new task
        const newTaskNotification: Notification = {
            id: `new-${task.id}`,
            type: "new_task",
            message: `New task "${task.title}" has been created`,
            timestamp: new Date(),
            taskId: task.id,
        };
        setNotifications(prev => [...prev, newTaskNotification]);

        toast({
            title: "Task Added",
            description: "Your task has been successfully created.",
        });

        // Reload the page
        window.location.reload();
    };

    const handleCompleteTask = async (event: CalendarEvent) => {
        await completeTask(event.id);
        window.location.reload();
        toast({
            title: "Task Completed",
            description: "Your task has been marked as completed.",
        });
    };


    const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );

        if (!updatedEvent.id) return;

        const updatedTask: Partial<TaskInput> = {
            title: updatedEvent.title,
            date: updatedEvent.date,
            startTime: updatedEvent.startTime,
            endTime: updatedEvent.endTime,
            color: updatedEvent.color,
            description: updatedEvent.description,
            assignees: updatedEvent.assignees?.map(assignee => assignee.id),
            completed: updatedEvent.completed,
        };

        // Remove undefined values
        const cleanedTask = Object.fromEntries(
            Object.entries(updatedTask).filter(([_, value]) => value !== undefined)
        );

        await updateTask(updatedEvent.id, cleanedTask);

        toast({
            title: "Task Moved",
            description: "Your task has been moved to a new date.",
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleMarkNotificationAsRead = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const handleClearAllNotifications = () => {
        setNotifications([]);
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

                <div className="flex items-center gap-6">
                    <UserList people={people} onUserClick={handleUserClick} />
                    <div className="flex items-center gap-4">
                        <ViewSelector currentView={view} onViewChange={setView} />
                        <NotificationBell
                            notifications={notifications}
                            onMarkAsRead={handleMarkNotificationAsRead}
                            onClearAll={handleClearAllNotifications}
                        />
                        <Button onClick={() => setShowAddTask(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Task
                        </Button>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu((prev) => !prev)}
                                className="p-2 rounded-full border hover:bg-muted"
                            >
                                <UserIcon className="h-5 w-5" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded z-10">
                                    <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                                        {user?.email ?? "Unknown"}
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CalendarHeader>

            <div className="px-4 py-3 bg-muted/50 border-b border-calendar-grid">
                {selectedUserId ? (
                    <p className="py-4 bg-muted/50 border-b border-calendar-grid flex justify-center">
                        You are viewing tasks of {people.find((p) => p.id === selectedUserId)?.name || "Unknown"}
                    </p>
                ) : (
                    <p className="py-4 bg-muted/50 border-b border-calendar-grid flex justify-center">
                        You are viewing your tasks
                    </p>
                )}
            </div>

            <CalendarGrid
                currentDate={currentDate}
                events={events}
                view={view}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                onEventUpdate={handleEventUpdate}
            />

            <TaskDetailDialog
                event={selectedEvent}
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onDelete={deleteTask}
                onComplete={handleCompleteTask}
                isAdmin={people.find((p) => p.id === user?.uid)?.isAdmin ?? false}
                onEventUpdate={handleEventUpdate}
                people={people}
            />

            <AddTaskDialog
                isOpen={showAddTask}
                onClose={() => setShowAddTask(false)}
                onAddTask={handleAddTask}
                people={people}
            />

            <DateTasksDialog
                isOpen={!!selectedDate}
                onClose={() => setSelectedDate(null)}
                date={selectedDate}
                events={selectedDateEvents}
                onEventClick={handleEventClick}
            />
        </div>
    );
};