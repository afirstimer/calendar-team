import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarEvent } from "./Calendar";
import { Clock, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button"; // adjust path if needed

interface TaskDetailDialogProps {
    event: CalendarEvent | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
    onComplete: (event: CalendarEvent) => void;
    isAdmin?: boolean;
}

export const TaskDetailDialog = ({ event, isOpen, onClose, onDelete, onComplete, isAdmin }: TaskDetailDialogProps) => {
    if (!event) return null;

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className={event.completed ? "line-through text-muted-foreground" : "text-lg font-semibold"}>
                        {event.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
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
                                    <div key={person} className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs font-medium uppercase">
                                                {person}
                                            </AvatarFallback>
                                        </Avatar>
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
              `}
                        >
                            {event.color === "blue" ? "Thấp" : ""}
                            {event.color === "red" ? "Cao" : ""}
                        </Badge>
                    </div>
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    {!event.completed && (
                        <Button
                            onClick={() => {
                                onComplete(event);
                                onClose();
                            }}
                            variant="default"
                        >
                            Mark as Completed
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {isAdmin && (
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (event.id) {
                                    onDelete(event.id);
                                    onClose();
                                }
                            }}
                        >
                            Delete Task
                        </Button>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
};