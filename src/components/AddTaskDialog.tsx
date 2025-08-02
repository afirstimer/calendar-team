import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
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
    const [descriptionType, setDescriptionType] = useState<"text" | "todo">("text");
    const [todoItems, setTodoItems] = useState<string[]>([""]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [repeat, setRepeat] = useState<"none" | "daily" | "weekly" | "monthly">("none");

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const addTodoItem = () => {
        setTodoItems([...todoItems, ""]);
    };

    const removeTodoItem = (index: number) => {
        setTodoItems(todoItems.filter((_, i) => i !== index));
    };

    const updateTodoItem = (index: number, value: string) => {
        const newTodoItems = [...todoItems];
        newTodoItems[index] = value;
        setTodoItems(newTodoItems);
    };

    const getPriorityColor = (priority: "low" | "medium" | "high") => {
        switch (priority) {
            case "low": return "blue";
            case "medium": return "yellow";
            case "high": return "red";
            default: return "blue";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        const assignees = people.filter(person => selectedPeople.includes(person.id));
        const finalDescription = descriptionType === "todo"
            ? todoItems.filter(item => item.trim()).map(item => `• ${item}`).join("\n")
            : description;
        const [year, month, day] = date.split("-").map(Number);
        const localDate = new Date(year, month - 1, day);

        onAddTask({
            title,
            description: finalDescription,
            date: localDate.toISOString(),
            startTime: isAllDay ? "" : startTime,
            endTime: isAllDay ? "" : endTime,
            color: getPriorityColor(priority),
            allDay: isAllDay,
            assignees: assignees.map((a) => a.id),
            priority,
            repeat,
        });

        // Reset form
        setTitle("");
        setDescription("");
        setDescriptionType("text");
        setTodoItems([""]);
        setDate(new Date().toISOString().split("T")[0]);
        setStartTime("09:00");
        setEndTime("10:00");
        setPriority("low");
        setIsAllDay(false);
        setSelectedPeople([]);
        setRepeat("none");
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
                        <Label>Description Type</Label>
                        <RadioGroup
                            value={descriptionType}
                            onValueChange={(value: "text" | "todo") => setDescriptionType(value)}
                            className="flex flex-row gap-4 mt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="text" id="text" />
                                <Label htmlFor="text">Text</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="todo" id="todo" />
                                <Label htmlFor="todo">To-do List</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {descriptionType === "text" ? (
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
                    ) : (
                        <div>
                            <Label>To-do Items</Label>
                            <div className="space-y-2 mt-2">
                                {todoItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => updateTodoItem(index, e.target.value)}
                                            placeholder={`Item ${index + 1}`}
                                            className="flex-1"
                                        />
                                        {todoItems.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeTodoItem(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addTodoItem}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    )}

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
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Bình thường (Blue)</SelectItem>
                                <SelectItem value="high">Quan Trọng (Red)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="repeat">Repeat</Label>
                        <Select value={repeat} onValueChange={(value: "none" | "daily" | "weekly" | "monthly") => setRepeat(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Repeat</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Assign to people</Label>
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                            {people.map((person) => (
                                <div
                                    key={person.id}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={selectedPeople.includes(person.id)}
                                        onCheckedChange={() => togglePersonSelection(person.id)}
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