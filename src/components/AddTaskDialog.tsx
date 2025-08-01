import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarEvent, Person } from "./Calendar";

interface AddTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTask: (task: Omit<CalendarEvent, "id">) => void;
    people: Person[];
}

export const AddTaskDialog = ({ isOpen, onClose, onAddTask, people }: AddTaskDialogProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [color, setColor] = useState<"blue" | "red" | "purple" | "green">("blue");
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const assignees = people.filter(person => selectedPeople.includes(person.id));

        onAddTask({
            title,
            description,
            date,
            startTime: isAllDay ? "" : startTime,
            endTime: isAllDay ? "" : endTime,
            color,
            allDay: isAllDay,
            assignees: selectedPeople,
        });

        // Reset form
        setTitle("");
        setDescription("");
        setDate(new Date().toISOString().split("T")[0]);
        setStartTime("09:00");
        setEndTime("10:00");
        setColor("blue");
        setIsAllDay(false);
        setSelectedPeople([]);
    };

    const togglePersonSelection = (personId: string) => {
        setSelectedPeople(prev =>
            prev.includes(personId)
                ? prev.filter(id => id !== personId)
                : [...prev, personId]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="allDay"
                            checked={isAllDay}
                            onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
                        />
                        <Label htmlFor="allDay">All day event</Label>
                    </div>

                    {!isAllDay && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="color">Color</Label>
                        <Select value={color} onValueChange={(value: "blue" | "red" | "purple" | "green") => setColor(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Assign to people</Label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                            {people.map((person) => (
                                <div
                                    key={person.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        checked={selectedPeople.includes(person.id)}
                                        onCheckedChange={(checked: boolean) => {
                                            if (checked) {
                                                setSelectedPeople((prev) => [...prev, person.id]);
                                            } else {
                                                setSelectedPeople((prev) => prev.filter((id) => id !== person.id));
                                            }
                                        }}
                                    />
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">
                                            {getInitials(person.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{person.name}</span>
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Task</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};