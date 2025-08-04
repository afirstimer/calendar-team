import { CalendarEvent } from "./Calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DateTasksDialogProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
    events: CalendarEvent[];
    onEventClick?: (event: CalendarEvent) => void;
}

export const DateTasksDialog = ({
    isOpen,
    onClose,
    date,
    events,
    onEventClick
}: DateTasksDialogProps) => {
    if (!date) return null;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Tasks for {formatDate(date)}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-3">
                        {events.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No tasks for this date
                            </p>
                        ) : (
                            events.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => {
                                        onEventClick?.(event);
                                        onClose();
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: `hsl(var(--event-${event.color}))` }}
                                                />
                                                <h4 className={event.completed ? "line-through" : "font-medium text-sm"}>{event.title}</h4>
                                            </div>

                                            {!event.allDay && (
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {event.startTime} - {event.endTime}
                                                </p>
                                            )}

                                            {event.description && (
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {event.description}
                                                </p>
                                            )}

                                            {event.assignees && event.assignees.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    {event.assignees.slice(0, 3).map((assignee) => (
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="text-xs">
                                                                {assignee}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    {event.assignees.length > 3 && (
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            +{event.assignees.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};