import { Button } from "@/components/ui/button";
import { CalendarView } from "./Calendar";

interface ViewSelectorProps {
    currentView: CalendarView;
    onViewChange: (view: CalendarView) => void;
}

export const ViewSelector = ({ currentView, onViewChange }: ViewSelectorProps) => {
    const views: { key: CalendarView; label: string }[] = [
        { key: "month", label: "month" },
        { key: "week", label: "week" },
        { key: "day", label: "day" },
        { key: "list", label: "list" },
        { key: "resources", label: "resources" },
        { key: "timeline", label: "timeline" },
    ];

    return (
        <div className="flex items-center gap-1 border border-border rounded-md p-1">
            {views.map((view) => (
                <Button
                    key={view.key}
                    variant={currentView === view.key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(view.key)}
                    className="h-7 px-3 text-xs"
                >
                    {view.label}
                </Button>
            ))}
        </div>
    );
};