import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarEvent, Person } from "./Calendar";
import { Clock, Calendar, Users, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";

interface TaskDetailDialogProps {
    event: CalendarEvent | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    onComplete: (event: CalendarEvent) => void;
    isAdmin?: boolean;
    onEventUpdate?: (event: CalendarEvent) => void;
    people?: Person[];
}

export const TaskDetailDialog = ({ event, isOpen, onClose, onDelete, onComplete, isAdmin, onEventUpdate, people = [] }: TaskDetailDialogProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        color: "blue" as "blue" | "red" | "purple" | "green" | "orange",
        priority: "medium" as "low" | "medium" | "high",
        assignees: [] as Person[]
    });

    useEffect(() => {
        if (event) {
            setEditForm({
                title: event.title,
                description: event.description || "",
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                color: event.color,
                priority: event.priority || "medium",
                assignees: event.assignees || []
            });
        }
    }, [event]);

    if (!event) return null;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const formatTime = (startTime: string, endTime: string) => {
        if (!startTime || !endTime) return "All day";

        const formatTime12 = (time: string) => {
            const [hours, minutes] = time.split(":");
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        };

        return `${formatTime12(startTime)} – ${formatTime12(endTime)}`;
    };

    const handleSave = () => {
        if (!onEventUpdate) return;

        const updatedEvent: CalendarEvent = {
            ...event,
            ...editForm
        };

        onEventUpdate(updatedEvent);
        setIsEditing(false);
        onClose();
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (event) {
            setEditForm({
                title: event.title,
                description: event.description || "",
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                color: event.color,
                priority: event.priority || "medium",
                assignees: event.assignees || []
            });
        }
    };

    const togglePersonSelection = (person: Person) => {
        setEditForm(prev => ({
            ...prev,
            assignees: prev.assignees.some(p => p.id === person.id)
                ? prev.assignees.filter(p => p.id !== person.id)
                : [...prev.assignees, person]
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className={event.completed ? "line-through text-muted-foreground" : "text-lg font-semibold"}>
                            {isEditing ? "Edit Task" : event.title}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {isEditing ? (
                        <>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Title</label>
                                <Input
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Task title"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Description</label>
                                <Textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Task description"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Date</label>
                                <Input
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Start Time</label>
                                    <Input
                                        type="time"
                                        value={editForm.startTime}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">End Time</label>
                                    <Input
                                        type="time"
                                        value={editForm.endTime}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Color</label>
                                <Select value={editForm.color} onValueChange={(value: any) => setEditForm(prev => ({ ...prev, color: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="red">Red</SelectItem>
                                        <SelectItem value="purple">Purple</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                        <SelectItem value="orange">Orange</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Priority</label>
                                <Select value={editForm.priority} onValueChange={(value: any) => setEditForm(prev => ({ ...prev, priority: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {people.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium mb-3 block">Assign to</label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {people.map((person) => (
                                            <div key={person.id} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={`edit-person-${person.id}`}
                                                    checked={editForm.assignees.some(p => p.id === person.id)}
                                                    onCheckedChange={() => togglePersonSelection(person)}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(person.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <label htmlFor={`edit-person-${person.id}`} className="text-sm cursor-pointer">
                                                        {person.name}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button onClick={handleSave} className="flex-1 gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                                <Button variant="outline" onClick={handleCancel} className="gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(event.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(event.startTime, event.endTime)}</span>
                            </div>

                            {event.description && (
                                <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                </div>
                            )}

                            {event.assignees && event.assignees.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users className="h-4 w-4" />
                                        <h4 className="font-medium">Assigned to</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {event.assignees.map((person) => (
                                            <div key={person.id} className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs font-medium">
                                                        {person}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{person.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <Badge
                                    variant="outline"
                                    className={`
                    ${event.color === "blue" ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
                    ${event.color === "red" ? "border-red-200 bg-red-50 text-red-700" : ""}
                    ${event.color === "purple" ? "border-purple-200 bg-purple-50 text-purple-700" : ""}
                    ${event.color === "green" ? "border-green-200 bg-green-50 text-green-700" : ""}
                    ${event.color === "orange" ? "border-orange-200 bg-orange-50 text-orange-700" : ""}
                  `}
                                >
                                    {event.color}
                                </Badge>
                            </div>
                        </>
                    )}
                </div>
                {!isEditing && onEventUpdate && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="gap-2"
                    >
                        <Edit2 className="h-4 w-4" />
                        Edit
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
};